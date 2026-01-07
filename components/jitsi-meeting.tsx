"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"

declare global {
  interface Window {
    JitsiMeetExternalAPI: any
  }
}

export function JitsiMeeting({ roomName, userName }: { roomName: string; userName: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<any>(null)

  useEffect(() => {
    // Load Jitsi Meet API script
    const script = document.createElement("script")
    script.src = "https://meet.jit.si/external_api.js"
    script.async = true
    script.onload = () => {
      if (containerRef.current && window.JitsiMeetExternalAPI) {
        apiRef.current = new window.JitsiMeetExternalAPI("meet.jit.si", {
          roomName: roomName,
          parentNode: containerRef.current,
          width: "100%",
          height: 600,
          userInfo: {
            displayName: userName,
          },
          configOverwrite: {
            startWithAudioMuted: true,
            startWithVideoMuted: false,
          },
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              "microphone",
              "camera",
              "closedcaptions",
              "desktop",
              "fullscreen",
              "fodeviceselection",
              "hangup",
              "profile",
              "chat",
              "recording",
              "livestreaming",
              "etherpad",
              "sharedvideo",
              "settings",
              "raisehand",
              "videoquality",
              "filmstrip",
              "stats",
              "shortcuts",
              "tileview",
              "videobackgroundblur",
              "download",
              "help",
              "mute-everyone",
            ],
          },
        })
      }
    }
    document.head.appendChild(script)

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose()
      }
    }
  }, [roomName, userName])

  return (
    <Card className="overflow-hidden">
      <div ref={containerRef} className="w-full" />
    </Card>
  )
}
