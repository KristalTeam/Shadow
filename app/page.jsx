import styles from './page.module.css'
import Box from "components/Box"
import NewTab from "components/NewTab"
import Link from "next/link"

export default function Home() {

    const mods = [
        {
            title: "Godhome",
            description: "Take your place amongst the Gods. 40+ boss fights, challenge modes, and a unique ending. Contains major spoilers for Hollow Knight.",
            image: "/screenshots/godhome.png",
            page: "https://gamebanana.com/mods/376524",
            author: "Vitellary",
            author_link: null
        },
        {
            title: "Deoxynn",
            description: "Alexa Greene, a victim of something terrible, starts her adventure through the world of Europa. Will she make new friends and keep sane, or will she succumb to her insanity? The choice is yours.",
            image: "/screenshots/deoxynn.png",
            page: "https://gamebanana.com/mods/434334",
            author: "AcousticJamm",
            author_link: "https://www.guilded.gg/i/240D4G02"
        },
        {
            title: "Deltarune: Missing Light",
            description: "Traverse through different worlds and realities, and save the multiverse from being consumed by darkness and anomalies!",
            image: "/screenshots/deltarune_missing_light.png",
            page: "https://gamejolt.com/games/missinglight/799416",
            author: "DiamondBor",
            author_link: "https://www.youtube.com/channel/UCs76CI1gJeWx77sSTCCbICA"
        },
        {
            title: "Frozen Heart",
            description: "The end of the Snowgrave Route seen from another place. While Kris gets torn to pieces by a bootleg Mettaton NEO, Susie has to face Noelle, lost in the trance of the Thorn Ring, before she freezes her to death! And who knows, maybe the situation can get even worse than that?",
            image: "/screenshots/frozen_heart.png",
            page: "https://gamejolt.com/games/frozen-heart/659908",
            author: "Simbel",
            author_link: "https://www.youtube.com/@Simbel"
        },
        {
            title: "Deltamon",
            description: "Explore the vast region that Kris calls home as you aid them in becoming champion! Your rivals Susie, Noelle and Berdly join alongside you to see and catch over 200+ pokémon from Kanto to Paldea!",
            image: "/screenshots/deltamon.png",
            page: null,
            author: "Riverstar",
            author_link: "https://twitter.com/NoahLuc60171586"
        }
    ]

    return (
        <>
            <picture className={styles.logo}>
                <img src="title_logo_shadow.png" alt="title logo" />
            </picture>

            <section className={styles.section}>
                <Box>
                    <h2 className={styles.header}>What is this?</h2>
                    <p>
                        Kristal is a powerful <NewTab href="https://deltarune.com/">DELTARUNE</NewTab> fangame and battle engine, made with <NewTab href="https://love2d.org/">LÖVE</NewTab>. It allows you to make <b>custom DELTARUNE worlds, battles, and more!</b>
                    </p>
                </Box>

                <Box>
                    <h2 className={styles.header}>How do I use it?</h2>
                    <p>
                        Check out our <Link href="/wiki/">wiki</Link> for more information on how to use Kristal.
                        Please keep in mind that you <b>must know Lua, or be willing to learn it!</b> We have our own Lua tutorial <Link href="/wiki/lua-tutorial">here</Link> to help you get started.
                    </p>
                </Box>

                <Box>
                    <h2 className={styles.header}>Can I help?</h2>
                    <p>
                        <b>Yes!</b> Feel free to look through the <NewTab href="https://github.com/KristalTeam/Kristal">source code of Kristal</NewTab> and contribute if you wish.
                    </p>
                </Box>

                <Box>
                    <h2 className={styles.header}>Show some screenshots!</h2>
                    <br/>
                    <div className={styles.screenshots}>
                    {
                        mods.map((mod, index) => {
                            const img = <img className={styles.screenshot} src={mod.image}/>;
                            const info = <div className={styles.screenshot_info}>
                                <NewTab href={mod.page} className={styles.screenshot_title}>{mod.title}</NewTab>
                                <span className={styles.screenshot_author}>By <NewTab href={mod.author_link}>{mod.author}</NewTab></span>
                                <p className={styles.screenshot_description}>{mod.description}</p>
                                </div>;
                            const result = <div>
                                {img}
                                {info}
                            </div>
                            //return (index % 2 == 0) ? [img, info] : [info, img];
                            return result;
                        })
                    }
                    </div>
                </Box>
            </section>
        </>
    )
}
