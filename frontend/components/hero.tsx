import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>VoiceVibe AI 👩‍🦰 &nbsp;</h1>

        <br />
        <h1 className={title()}>Your </h1>
        <h1 className={title({ color: "violet" })}>Personal&nbsp;</h1>
        <br />
        <h1 className={title()}>Audio Diary</h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          Effortlessly document your thoughts, track your mood, and reflect on
          your journey with VoiceVibe AI.
        </h2>
        <h3>
          Your voice, your story, secured and analyzed with cutting-edge
          technology.
        </h3>
      </div>

      <div className="flex gap-3">
        <Link
          //   isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href={"/diary"}
        >
          Get Started🚀
        </Link>
        <Link
          //   isExternal
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href={"/about"}
        >
          How it works?🤔
        </Link>
      </div>

      <div className="mt-8 w-full">
        <div className="max-w-5xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Features 🚀
              </h2>
              <ul className="mt-4 text-gray-600 dark:text-gray-300 list-disc list-inside">
                <li>Voice-to-Text Transcription</li>
                <li>Emotion Analysis</li>
                <li>Secure Storage</li>
                <li>AI Conversations</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                How It Works 🧐
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                1. Speak your thoughts, and VoiceVibe AI transcribes them into
                text.
                <br />
                2. Analyze your emotions over time with built-in sentiment
                analysis.
                <br />
                3. Securely store your entries with encryption and share
                selectively.
                <br />
                4. Engage with an AI to reflect on your entries and gain
                insights.
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Tech Stack 🛠
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              - Frontend: Next.js, Tailwind CSS
              <br />
              - Backend: Node.js, Express
              <br />
              - Database: MongoDB
              <br />
              - Authentication: JSON Web Tokens (JWT)
              <br />
              - Voice Recognition: Web Speech API
              <br />- Emotion Analysis: Sentiment Analysis Libraries
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
