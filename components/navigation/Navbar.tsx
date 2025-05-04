"use client";

import { useState } from "react";
import Link from "next/link";
import { GithubIcon } from "lucide-react";

export type RankingTopic = { id: string; name: string };

interface NavbarProps {
  rankingTopics?: RankingTopic[];
  hideAbout?: boolean;
}

export function Navbar({ rankingTopics, hideAbout }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "Home", href: "/" },
    ...(!rankingTopics ? [{ name: "Rankings", href: "/ranking" }] : []),
    { name: "Compare", href: "/compare" },
    ...(!hideAbout
      ? [
          {
            name: "About",
            href: "/about",
          },
        ]
      : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <svg
                className="w-8 h-8 text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span className="font-bold text-xl text-gray-900">
                publicspending.world
              </span>
            </Link>
          </div>

          <div className="hidden sm:flex sm:items-center">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-500 hover:bg-gray-50 transition-colors"
              >
                {item.name}
              </Link>
            ))}
            {rankingTopics &&
              rankingTopics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/ranking/${topic.id}`}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-500 hover:bg-gray-50 transition-colors"
                >
                  {topic.name}
                </Link>
              ))}
            <Link
              href="https://github.com/samuelcorsan/publicspending.world/pulls"
              target="_blank"
            >
              <button className="flex items-center cursor-pointer ml-4 px-4 py-2 rounded-full bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors">
                <GithubIcon className="w-4 mr-1" />
                Contribute on GitHub
              </button>
            </Link>
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-500 hover:bg-gray-50"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="sm:hidden pb-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-500 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {rankingTopics &&
              rankingTopics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/ranking/${topic.id}`}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-500 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {topic.name}
                </Link>
              ))}
            <Link
              href="https://github.com/samuelcorsan/publicspending.world/pulls"
              target="_blank"
            >
              <button className="w-full flex items-center cursor-pointer px-4 py-2 rounded-full bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors">
                <GithubIcon className="w-4 mr-1" />
                Contribute on GitHub
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
