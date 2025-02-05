"use client"
import type React from "react"
import { useState, useEffect } from "react"

interface TypewriterProps {
  text: string
  typingSpeed?: number
  deletingSpeed?: number
  delayBeforeDelete?: number
  delayBeforeRestart?: number
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  typingSpeed = 50,
  deletingSpeed = 30,
  delayBeforeDelete = 1000,
  delayBeforeRestart = 500,
}) => {
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isWaiting) {
      timer = setTimeout(
        () => {
          setIsWaiting(false)
          setIsDeleting(!isDeleting)
        },
        isDeleting ? delayBeforeRestart : delayBeforeDelete,
      )
    } else if (isDeleting) {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText((prevText) => prevText.slice(0, -1))
        }, deletingSpeed)
      } else {
        setIsWaiting(true)
      }
    } else {
      if (displayText.length < text.length) {
        timer = setTimeout(() => {
          setDisplayText((prevText) => text.slice(0, prevText.length + 1))
        }, typingSpeed)
      } else {
        setIsWaiting(true)
      }
    }

    return () => clearTimeout(timer)
  }, [displayText, isDeleting, isWaiting, text, typingSpeed, deletingSpeed, delayBeforeDelete, delayBeforeRestart])

  return (
    <div className="typewriter">
      {displayText}
      <span className="cursor"></span>
      <style jsx>{`
        .typewriter {
          font-family: Arial;
          font-size: 28px;
          white-space: pre-wrap;
          word-break: break-word;
          font-weight:bold;
          background: linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        }
        .cursor {
          display: inline-block;
          width: 2px;
          height: 24px;
          background-color: #fff;
          animation: blink 0.7s infinite;
          
        }
          @media (min-width: 1024px) {
    .typewriter {
      font-size: 42px; /* Increase text size */
    }
    .cursor {
      width: 3px; /* Make cursor thicker */
      height: 32px; /* Make cursor taller */
    }
  }
        @keyframes blink {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}


