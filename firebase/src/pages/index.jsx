import { useRouter } from 'next/router'
import React, { useEffect } from 'react'


export default function Home() {
  const router = useRouter()
  useEffect(() => {
    if (router.asPath === '/') {
      return;
    }
    router.push(router.asPath)

  }, [router])
  return (
    <div>Strona główna</div>
  )
}
