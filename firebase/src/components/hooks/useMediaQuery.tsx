import { useEffect, useState } from 'react'

export type ScreenSize = "SMALL" | "BIG" 

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

    if (smallScreen) {
        return "SMALL"
    } else {
        return "BIG"
    }
}

export default useMediaQuery