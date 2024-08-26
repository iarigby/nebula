'use client'


import Player from "@/components/player";
import {useEffect, useState} from "react";
import Synth from "@/components/synth";

export default function Home() {
    return <main>
        <PlayerPage/>
    </main>
}


function PlayerPage() {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    return isClient ? <><Player/><Synth/></> : <div>Loading</div>
}