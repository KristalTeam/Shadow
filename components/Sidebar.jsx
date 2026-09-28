"use client"

import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./Sidebar.module.css";
import Searchbar from 'components/Searchbar'

export function SidebarSection({ children, title, url, description }) {
    return <div className={styles.section}>
        <h3><Link href={url}>{title}</Link></h3>
        <p>{description}</p>
        <ul>
            {children}
        </ul>
    </div>
}

export function SidebarEntry({ title, url }) {
    return <li><Link href={url}>{title}</Link></li>
}

export default function Sidebar(props) {
    const sidebarRef = useRef(null);

    /* Handle dynamic sidebar height */
    useEffect(() => {
        const sidebarEl = sidebarRef.current;
        if (!sidebarEl) return;

        const navbarEl = document.getElementById("wiki-navbar");

        const updateSidebarOffset = () => {
            if (!navbarEl) {
                sidebarEl.style.setProperty("--sidebar-offset", "0px");
                return;
            }

            const navbarRect = navbarEl.getBoundingClientRect();
            const offset = Math.max(0, navbarRect.bottom);
            sidebarEl.style.setProperty("--sidebar-offset", `${offset}px`);
        };

        let raf = null;
        const scheduleUpdate = () => {
            if (raf !== null) return;
            raf = requestAnimationFrame(() => {
                raf = null;
                updateSidebarOffset();
            });
        };

        updateSidebarOffset();
        window.addEventListener("scroll", scheduleUpdate, { passive: true });
        window.addEventListener("resize", scheduleUpdate);

        return () => {
            if (raf !== null) cancelAnimationFrame(raf);
            window.removeEventListener("scroll", scheduleUpdate);
            window.removeEventListener("resize", scheduleUpdate);
        };
    }, []);

    /* Content */

    let toggleTitle = <h2>Kristal Wiki</h2>
    let content = <>
        <SidebarSection
            title="General Information"
            url="/wiki/"
            description="These pages get you ready to use the engine."
        >
            <SidebarEntry title="Main Page" url="/wiki/" />
            <SidebarEntry title="Downloading Kristal" url="/wiki/downloading" />
            <SidebarEntry title="Installing and Playing Projects" url="/wiki/playing-mods" />
            <SidebarEntry title="Glossary" url="/wiki/glossary" />
        </SidebarSection>

        <SidebarSection
            title="General Project Creation"
            url="/wiki/mod-creation/"
            description="These pages teach you about project development."
        >
            <SidebarEntry title="Lua Tutorial" url="/wiki/lua-tutorial" />
            <SidebarEntry title="Understanding the Basics" url="/wiki/basics" />
            <SidebarEntry title="Classes and Instances" url="/wiki/classes-and-instances" />
            <SidebarEntry title="Creating a Project" url="/wiki/creating-a-mod" />
            <SidebarEntry title="Objects" url="/wiki/objects" />
            <SidebarEntry title="Writing Text" url="/wiki/writing-text" />
            <SidebarEntry title="Using Libraries" url="/wiki/using-libraries" />
            <SidebarEntry title="Creating an Item" url="/wiki/creating-an-item" />
            <SidebarEntry title="Creating a Shop" url="/wiki/making-shops" />
            <SidebarEntry title="Creating a Spell" url="/wiki/creating-a-spell" />
            <SidebarEntry title="Actors" url="/wiki/actors" />
            <SidebarEntry title="Party Members" url="/wiki/party-members" />
            <SidebarEntry title="Custom Keybinds" url="/wiki/keybinds" />
            <SidebarEntry title="Releasing Projects" url="/wiki/releasing-mods" />
        </SidebarSection>

        <SidebarSection
            title="The Overworld"
            url="/wiki/mod-creation#the-overworld"
            description="Everything to do with the overworld."
        >
            <SidebarEntry title="Designing a Map" url="/wiki/designing-a-map" />
            <SidebarEntry title="Map Layers" url="/wiki/map-layers" />
            <SidebarEntry title="Cutscenes" url="/wiki/cutscenes" />
            <SidebarEntry title="Map Properties" url="/wiki/map-properties" />
            <SidebarEntry title="Events" url="/wiki/using-events" />
            <SidebarEntry title="Battle Areas" url="/wiki/battle-areas" />
            <SidebarEntry title="Climbing" url="/wiki/climbing" />
            <SidebarEntry title="The World Tool" url="/wiki/world-tool" />
        </SidebarSection>

        <SidebarSection
            title="Battles"
            url="/wiki/mod-creation#battles"
            description="Everything related to creating battles."
        >
            <SidebarEntry title="Battlers" url="/wiki/battlers" />
            <SidebarEntry title="Encounters" url="/wiki/encounters" />
            <SidebarEntry title="Enemy Attacks (Waves)" url="/wiki/enemy-attacks" />
            <SidebarEntry title="Wavemaking Tricks and References" url="/wiki/wavemaking-reference" />
        </SidebarSection>

        <SidebarSection
            title="Advanced"
            url="/wiki/mod-creation#advanced-mod-creation"
            description="These pages teach you more complex but powerful parts of the engine."
        >
            <SidebarEntry title="Debugging" url="/wiki/debugging" />
            <SidebarEntry title="Hooks" url="/wiki/hooks" />
            <SidebarEntry title="The UI System" url="/wiki/ui" />
        </SidebarSection>

        <SidebarSection
            title="API Reference"
            url="/wiki/api"
            description="An auto-generated API reference for Kristal."
            ></SidebarSection>

        {/*<Link href="#top" style={{textAlign: "center"}}>⮬ Back to Top ⮭</Link>*/}
    </>

    return <>
        <div ref={sidebarRef} className={styles.sidebar}>
            {toggleTitle}
            <Searchbar id="header-search" placeholder="Search Wiki" submit="Go"/>
            {content}
        </div>
        <div className={styles["mobile-sidebar"]}>
            <Searchbar id="mobile-header-search" placeholder="Search Wiki" submit="Go"/>
            <details>
                <summary>
                    {toggleTitle}
                </summary>
                {content}
            </details>
        </div>
    </>
}