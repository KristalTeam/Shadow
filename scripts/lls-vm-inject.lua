
---for exporting, only gets unique, noninherited fields
---@param suri uri
---@param object vm.global
---@param key string|number|integer|boolean|vm.global|vm.ANY
---@param pushResult fun(field: vm.object | vm.global, isMark?: boolean, discardParentFields?: boolean)
function vm.getSimpleClassFields(suri, object, key, pushResult)
    local mark = {}
    local function searchClass(class, searchedFields, discardParentFields)
        local name = class.name
        if mark[name] then
            return
        end
        mark[name] = true
        searchedFields = searchedFields or {}
        searchedFields[1] = searchedFields[1] or {}
        searchedFields[name] = searchedFields[name] or {}
        local function uniqueOrOverrideField(fieldKey)
            if(class == object) then
                --search only this class's tree if end of branch
                return not searchedFields[name][fieldKey]
            else
                --search whole tree
                return not searchedFields[1][fieldKey]
            end
        end

        local hasFounded = {}
        local function copyToSearched()
            for fieldKey in pairs(hasFounded) do
                searchedFields[name][fieldKey] = true
                searchedFields[1][fieldKey] = true
                hasFounded[fieldKey] = nil
            end
        end

        local sets = class:getSets(suri)
        --go fully up the class tree first and exhaust it all
        for _, set in ipairs(sets) do
            if set.type == 'doc.class' then
                -- look into extends(if field not found)
                if not searchedFields[key] and set.extends then
                    for _, extend in ipairs(set.extends) do
                        if extend.type == 'doc.extends.name' then
                            local extendType = vm.getGlobal('type', extend[1])
                            if extendType then
                                pushResult(extendType, true, false)
                                searchClass(extendType, searchedFields, true)
                            end
                        end
                    end
                end
            end
        end
        copyToSearched()

        for _, set in ipairs(sets) do
            if set.type == 'doc.class' then
                -- check ---@field
                for _, field in ipairs(set.fields) do
                    local fieldKey = guide.getKeyName(field)
                    if fieldKey then
                        -- ---@field x boolean -> class.x
                        if key == vm.ANY
                        or fieldKey == key then
                            if uniqueOrOverrideField(fieldKey) then
                                pushResult(field, true, discardParentFields)
                                hasFounded[fieldKey] = true
                            end
                        end
                        goto CONTINUE
                    end
                    if key == vm.ANY then
                        pushResult(field, true, discardParentFields)
                        goto CONTINUE
                    end
                    if hasFounded[key] then
                        goto CONTINUE
                    end
                    local keyType = type(key)
                    if keyType == 'table' then
                        -- ---@field [integer] boolean -> class[integer]
                        local fieldNode = vm.compileNode(field.field)
                        if vm.isSubType(suri, key.name, fieldNode) then
                            local nkey = '|' .. key.name
                            if uniqueOrOverrideField(nkey) then
                                pushResult(field, true, discardParentFields)
                                hasFounded[nkey] = true
                            end
                        end
                    else
                        local keyObject
                        if keyType == 'number' then
                            if math.tointeger(key) then
                                keyObject = { type = 'integer', [1] = key }
                            else
                                keyObject = { type = 'number', [1] = key }
                            end
                        elseif keyType == 'boolean'
                        or     keyType == 'string' then
                            keyObject = { type = keyType, [1] = key }
                        end
                        if keyObject and field.field.type ~= 'doc.field.name' then
                            -- ---@field [integer] boolean -> class[1]
                            local fieldNode = vm.compileNode(field.field)
                            if vm.isSubType(suri, keyObject, fieldNode) then
                                local nkey = '|' .. keyType
                                if uniqueOrOverrideField(nkey) then
                                    pushResult(field, true, discardParentFields)
                                    hasFounded[nkey] = true
                                end
                            end
                        end
                    end
                    ::CONTINUE::
                end
            end
        end
        copyToSearched()

        for _, set in ipairs(sets) do
            if set.type == 'doc.class' then
                -- check local field and global field
                if uniqueOrOverrideField(key) and set.bindSource then
                    local src = set.bindSource
                    if src.value and src.value.type == 'table' then
                        searchFieldSwitch('table', suri, src.value, key, function (field)
                            local fieldKey = guide.getKeyName(field)
                            if fieldKey then
                                if uniqueOrOverrideField(fieldKey)
                                and guide.isAssign(field) then
                                    hasFounded[fieldKey] = true
                                    pushResult(field, true, discardParentFields)
                                end
                            end
                        end)
                    end
                    if  src.value
                    and src.value.type == 'select'
                    and src.value.vararg.type == 'call' then
                        local func = src.value.vararg.node
                        local args = src.value.vararg.args
                        if  func.special == 'setmetatable'
                        and args
                        and args[1]
                        and args[1].type == 'table' then
                            searchFieldSwitch('table', suri, args[1], key, function (field)
                                local fieldKey = guide.getKeyName(field)
                                if fieldKey then
                                    if uniqueOrOverrideField(fieldKey)
                                    and guide.isAssign(field) then
                                        hasFounded[fieldKey] = true
                                        pushResult(field, true, discardParentFields)
                                    end
                                end
                            end)
                        end
                    end
                end
            end
        end
        copyToSearched()

        for _, set in ipairs(sets) do
            if set.type == 'doc.class' then
                if uniqueOrOverrideField(key) and set.bindSource then
                    local src = set.bindSource
                    searchFieldSwitch(src.type, suri, src, key, function (field)
                        local fieldKey = guide.getKeyName(field)
                        if fieldKey and uniqueOrOverrideField(fieldKey) then
                            if  uniqueOrOverrideField(fieldKey)
                            and guide.isAssign(field)
                            and field.value then
                                if  vm.getVariableID(field)
                                and vm.getVariableID(field) == vm.getVariableID(field.value) then
                                elseif vm.getGlobalNode(src)
                                and    vm.getGlobalNode(src) == vm.getGlobalNode(field.value) then
                                else
                                    hasFounded[fieldKey] = true
                                end
                                pushResult(field, true, discardParentFields)
                            end
                        end
                    end)
                end
            end
        end
        copyToSearched()
    end

    local function searchGlobal(class)
        if class.cate == 'type' and class.name == '_G' then
            if key == vm.ANY then
                local sets = vm.getGlobalSets(suri, 'variable')
                for _, set in ipairs(sets) do
                    pushResult(set)
                end
            elseif type(key) == 'string' then
                local global = vm.getGlobal('variable', key)
                if global then
                    for _, set in ipairs(global:getSets(suri)) do
                        pushResult(set)
                    end
                end
            end
        end
    end

    searchClass(object)
    searchGlobal(object)
end
