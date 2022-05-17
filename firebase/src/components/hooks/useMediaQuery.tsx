import { useEffect, useState } from 'react'

export type ScreenSize = "SMALL" | "MEDIUM" | "BIG" | "NONE"

function useMediaQuery(query: string): boolean {

    const getMatches = (query: string): boolean => {
        if (typeof window !== 'undefined') {
            return window.matchMedia(query).matches
        }
        return false
    }


    const [matches, setMatches] = useState<boolean>(getMatches(query))


    function handleChange() {
        const matches = getMatches(query)
        setMatches(getMatches(query))
    }

    useEffect(() => {
        const matchMedia = window.matchMedia(query)
        handleChange()
        matchMedia.addEventListener('change', handleChange)
        return () => {
            matchMedia.removeEventListener('change', handleChange)
        }
    }, [query])

    return matches
}

export const screeSize = (): ScreenSize => {
    const smallScreen = useMediaQuery("(max-width:60rem)")
    const mediumScreen = useMediaQuery("(min-width:60rem)")
    const bigScreen = useMediaQuery("(min-width:90rem)")
    if (bigScreen) {
        return "BIG"
    } else if (mediumScreen) {
        return "MEDIUM"
    } else if (smallScreen) {
        return "SMALL"
    } else {
        return "NONE";
    }
}

export default useMediaQuery