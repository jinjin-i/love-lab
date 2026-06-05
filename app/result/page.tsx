'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { QUIZZES } from '@/lib/quizData'
import html2canvas from 'html2canvas'

const TAROT_SVGS: Record<string, string> = {
  // 불안-집착형: 떨리는 동심원 + 눈
  anxious: `<svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="260" rx="12" fill="#12101e" stroke="#c9a84c" stroke-width="1.5"/>
    <rect x="8" y="8" width="184" height="244" rx="8" fill="none" stroke="#c9a84c" stroke-width="0.6" opacity="0.35"/>
    <text x="16" y="28" font-size="10" fill="#c9a84c" opacity="0.5" font-family="Georgia">✦</text>
    <text x="184" y="28" font-size="10" fill="#c9a84c" opacity="0.5" font-family="Georgia" text-anchor="end">✦</text>
    <text x="16" y="250" font-size="10" fill="#c9a84c" opacity="0.5" font-family="Georgia">✦</text>
    <text x="184" y="250" font-size="10" fill="#c9a84c" opacity="0.5" font-family="Georgia" text-anchor="end">✦</text>
    <text x="100" y="32" text-anchor="middle" font-size="9" fill="#c9a84c" opacity="0.6" font-family="Georgia" letter-spacing="3">I</text>
    <circle cx="100" cy="128" r="68" fill="none" stroke="#c9a84c" stroke-width="0.4" opacity="0.12"/>
    <circle cx="100" cy="128" r="54" fill="none" stroke="#c9a84c" stroke-width="0.5" opacity="0.18"/>
    <circle cx="100" cy="128" r="40" fill="none" stroke="#c9a84c" stroke-width="0.7" opacity="0.28"/>
    <circle cx="100" cy="128" r="27" fill="none" stroke="#c9a84c" stroke-width="1" opacity="0.45"/>
    <circle cx="100" cy="128" r="15" fill="none" stroke="#c9a84c" stroke-width="1.2" opacity="0.65"/>
    <path d="M58 128 Q100 96 142 128 Q100 160 58 128Z" fill="none" stroke="#c9a84c" stroke-width="1.4" opacity="0.8"/>
    <circle cx="100" cy="128" r="6" fill="#c9a84c" opacity="0.4"/>
    <circle cx="100" cy="128" r="2.5" fill="#c9a84c" opacity="0.9"/>
    <line x1="100" y1="60" x2="100" y2="48" stroke="#c9a84c" stroke-width="0.7" opacity="0.35"/>
    <line x1="100" y1="196" x2="100" y2="208" stroke="#c9a84c" stroke-width="0.7" opacity="0.35"/>
    <line x1="32" y1="128" x2="20" y2="128" stroke="#c9a84c" stroke-width="0.7" opacity="0.35"/>
    <line x1="168" y1="128" x2="180" y2="128" stroke="#c9a84c" stroke-width="0.7" opacity="0.35"/>
    <line x1="52" y1="80" x2="43" y2="71" stroke="#c9a84c" stroke-width="0.7" opacity="0.25"/>
    <line x1="148" y1="80" x2="157" y2="71" stroke="#c9a84c" stroke-width="0.7" opacity="0.25"/>
    <line x1="52" y1="176" x2="43" y2="185" stroke="#c9a84c" stroke-width="0.7" opacity="0.25"/>
    <line x1="148" y1="176" x2="157" y2="185" stroke="#c9a84c" stroke-width="0.7" opacity="0.25"/>
    <line x1="20" y1="238" x2="180" y2="238" stroke="#c9a84c" stroke-width="0.5" opacity="0.35"/>
    <text x="100" y="252" text-anchor="middle" font-size="10" fill="#c9a84c" font-family="Georgia" letter-spacing="1">불안-집착형</text>
  </svg>`,

  // 회피-냉각형: 얼음 결정
  avoidant: `<svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="260" rx="12" fill="#0a1220" stroke="#7ab8d4" stroke-width="1.5"/>
    <rect x="8" y="8" width="184" height="244" rx="8" fill="none" stroke="#7ab8d4" stroke-width="0.6" opacity="0.35"/>
    <text x="16" y="28" font-size="10" fill="#7ab8d4" opacity="0.5" font-family="Georgia">✦</text>
    <text x="184" y="28" font-size="10" fill="#7ab8d4" opacity="0.5" font-family="Georgia" text-anchor="end">✦</text>
    <text x="16" y="250" font-size="10" fill="#7ab8d4" opacity="0.5" font-family="Georgia">✦</text>
    <text x="184" y="250" font-size="10" fill="#7ab8d4" opacity="0.5" font-family="Georgia" text-anchor="end">✦</text>
    <text x="100" y="32" text-anchor="middle" font-size="9" fill="#7ab8d4" opacity="0.6" font-family="Georgia" letter-spacing="3">II</text>
    <line x1="100" y1="55" x2="100" y2="205" stroke="#7ab8d4" stroke-width="0.9" opacity="0.45"/>
    <line x1="25" y1="130" x2="175" y2="130" stroke="#7ab8d4" stroke-width="0.9" opacity="0.45"/>
    <line x1="44" y1="74" x2="156" y2="186" stroke="#7ab8d4" stroke-width="0.9" opacity="0.45"/>
    <line x1="156" y1="74" x2="44" y2="186" stroke="#7ab8d4" stroke-width="0.9" opacity="0.45"/>
    <polygon points="100,100 120,111 120,133 100,144 80,133 80,111" fill="none" stroke="#7ab8d4" stroke-width="1.5" opacity="0.85"/>
    <polygon points="100,110 114,118 114,130 100,138 86,130 86,118" fill="#7ab8d4" opacity="0.1"/>
    <line x1="100" y1="55" x2="88" y2="67" stroke="#7ab8d4" stroke-width="0.7" opacity="0.45"/>
    <line x1="100" y1="55" x2="112" y2="67" stroke="#7ab8d4" stroke-width="0.7" opacity="0.45"/>
    <line x1="100" y1="205" x2="88" y2="193" stroke="#7ab8d4" stroke-width="0.7" opacity="0.45"/>
    <line x1="100" y1="205" x2="112" y2="193" stroke="#7ab8d4" stroke-width="0.7" opacity="0.45"/>
    <line x1="25" y1="130" x2="37" y2="118" stroke="#7ab8d4" stroke-width="0.7" opacity="0.45"/>
    <line x1="25" y1="130" x2="37" y2="142" stroke="#7ab8d4" stroke-width="0.7" opacity="0.45"/>
    <line x1="175" y1="130" x2="163" y2="118" stroke="#7ab8d4" stroke-width="0.7" opacity="0.45"/>
    <line x1="175" y1="130" x2="163" y2="142" stroke="#7ab8d4" stroke-width="0.7" opacity="0.45"/>
    <circle cx="44" cy="74" r="3" fill="#7ab8d4" opacity="0.5"/>
    <circle cx="156" cy="74" r="3" fill="#7ab8d4" opacity="0.5"/>
    <circle cx="44" cy="186" r="3" fill="#7ab8d4" opacity="0.5"/>
    <circle cx="156" cy="186" r="3" fill="#7ab8d4" opacity="0.5"/>
    <circle cx="100" cy="122" r="4" fill="#7ab8d4" opacity="0.75"/>
    <line x1="20" y1="238" x2="180" y2="238" stroke="#7ab8d4" stroke-width="0.5" opacity="0.35"/>
    <text x="100" y="252" text-anchor="middle" font-size="10" fill="#7ab8d4" font-family="Georgia" letter-spacing="1">회피-냉각형</text>
  </svg>`,

  // 안정-신뢰형: 세계수
  stable: `<svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="260" rx="12" fill="#0a1a10" stroke="#6abf8a" stroke-width="1.5"/>
    <rect x="8" y="8" width="184" height="244" rx="8" fill="none" stroke="#6abf8a" stroke-width="0.6" opacity="0.35"/>
    <text x="16" y="28" font-size="10" fill="#6abf8a" opacity="0.5" font-family="Georgia">✦</text>
    <text x="184" y="28" font-size="10" fill="#6abf8a" opacity="0.5" font-family="Georgia" text-anchor="end">✦</text>
    <text x="16" y="250" font-size="10" fill="#6abf8a" opacity="0.5" font-family="Georgia">✦</text>
    <text x="184" y="250" font-size="10" fill="#6abf8a" opacity="0.5" font-family="Georgia" text-anchor="end">✦</text>
    <text x="100" y="32" text-anchor="middle" font-size="9" fill="#6abf8a" opacity="0.6" font-family="Georgia" letter-spacing="3">III</text>
    <line x1="100" y1="195" x2="100" y2="100" stroke="#6abf8a" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
    <path d="M100 100 L78 72" stroke="#6abf8a" stroke-width="1.4" stroke-linecap="round" opacity="0.8"/>
    <path d="M100 100 L122 72" stroke="#6abf8a" stroke-width="1.4" stroke-linecap="round" opacity="0.8"/>
    <path d="M100 122 L74 104" stroke="#6abf8a" stroke-width="1.1" stroke-linecap="round" opacity="0.65"/>
    <path d="M100 122 L126 104" stroke="#6abf8a" stroke-width="1.1" stroke-linecap="round" opacity="0.65"/>
    <path d="M100 148 L68 134" stroke="#6abf8a" stroke-width="0.9" stroke-linecap="round" opacity="0.55"/>
    <path d="M100 148 L132 134" stroke="#6abf8a" stroke-width="0.9" stroke-linecap="round" opacity="0.55"/>
    <path d="M78 72 L64 54" stroke="#6abf8a" stroke-width="1" stroke-linecap="round" opacity="0.7"/>
    <path d="M78 72 L88 54" stroke="#6abf8a" stroke-width="1" stroke-linecap="round" opacity="0.7"/>
    <path d="M122 72 L112 54" stroke="#6abf8a" stroke-width="1" stroke-linecap="round" opacity="0.7"/>
    <path d="M122 72 L136 54" stroke="#6abf8a" stroke-width="1" stroke-linecap="round" opacity="0.7"/>
    <path d="M100 195 L84 208" stroke="#6abf8a" stroke-width="0.9" stroke-linecap="round" opacity="0.45"/>
    <path d="M100 195 L116 208" stroke="#6abf8a" stroke-width="0.9" stroke-linecap="round" opacity="0.45"/>
    <path d="M100 195 L78 218" stroke="#6abf8a" stroke-width="0.7" stroke-linecap="round" opacity="0.3"/>
    <path d="M100 195 L122 218" stroke="#6abf8a" stroke-width="0.7" stroke-linecap="round" opacity="0.3"/>
    <circle cx="64" cy="51" r="6" fill="#6abf8a" opacity="0.3"/>
    <circle cx="88" cy="51" r="5" fill="#6abf8a" opacity="0.28"/>
    <circle cx="100" cy="47" r="7" fill="#6abf8a" opacity="0.35"/>
    <circle cx="112" cy="51" r="5" fill="#6abf8a" opacity="0.28"/>
    <circle cx="136" cy="51" r="6" fill="#6abf8a" opacity="0.3"/>
    <line x1="20" y1="238" x2="180" y2="238" stroke="#6abf8a" stroke-width="0.5" opacity="0.35"/>
    <text x="100" y="252" text-anchor="middle" font-size="10" fill="#6abf8a" font-family="Georgia" letter-spacing="1">안정-신뢰형</text>
  </svg>`,

  // 구조자-반복형: 우로보로스 순환
  repeat: `<svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="260" rx="12" fill="#160e24" stroke="#a87acc" stroke-width="1.5"/>
    <rect x="8" y="8" width="184" height="244" rx="8" fill="none" stroke="#a87acc" stroke-width="0.6" opacity="0.35"/>
    <text x="16" y="28" font-size="10" fill="#a87acc" opacity="0.5" font-family="Georgia">✦</text>
    <text x="184" y="28" font-size="10" fill="#a87acc" opacity="0.5" font-family="Georgia" text-anchor="end">✦</text>
    <text x="16" y="250" font-size="10" fill="#a87acc" opacity="0.5" font-family="Georgia">✦</text>
    <text x="184" y="250" font-size="10" fill="#a87acc" opacity="0.5" font-family="Georgia" text-anchor="end">✦</text>
    <text x="100" y="32" text-anchor="middle" font-size="9" fill="#a87acc" opacity="0.6" font-family="Georgia" letter-spacing="3">IV</text>
    <circle cx="100" cy="128" r="52" fill="none" stroke="#a87acc" stroke-width="0.4" opacity="0.2"/>
    <circle cx="100" cy="128" r="40" fill="none" stroke="#a87acc" stroke-width="1.8" opacity="0.65"/>
    <circle cx="100" cy="128" r="28" fill="none" stroke="#a87acc" stroke-width="0.5" opacity="0.25"/>
    <path d="M100 88 Q155 88 155 128 Q155 168 100 168 Q45 168 45 128 Q45 100 68 90" fill="none" stroke="#a87acc" stroke-width="1.8" stroke-linecap="round" opacity="0.75"/>
    <path d="M64 84 L68 90 L74 84" fill="none" stroke="#a87acc" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.75"/>
    <text x="100" y="118" text-anchor="middle" font-size="9" fill="#a87acc" opacity="0.45" font-family="Georgia">✦</text>
    <text x="158" y="130" text-anchor="middle" font-size="9" fill="#a87acc" opacity="0.45" font-family="Georgia">✦</text>
    <text x="100" y="178" text-anchor="middle" font-size="9" fill="#a87acc" opacity="0.45" font-family="Georgia">✦</text>
    <text x="42" y="130" text-anchor="middle" font-size="9" fill="#a87acc" opacity="0.45" font-family="Georgia">✦</text>
    <circle cx="100" cy="128" r="5" fill="#a87acc" opacity="0.6"/>
    <circle cx="100" cy="128" r="2" fill="#a87acc" opacity="0.9"/>
    <line x1="20" y1="238" x2="180" y2="238" stroke="#a87acc" stroke-width="0.5" opacity="0.35"/>
    <text x="100" y="252" text-anchor="middle" font-size="10" fill="#a87acc" font-family="Georgia" letter-spacing="1">구조자-반복형</text>
  </svg>`,

  // 관심-숨김형: 반달 + 별
  hidden: `<svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="260" rx="12" fill="#1e0e14" stroke="#d4846a" stroke-width="1.5"/>
    <rect x="8" y="8" width="184" height="244" rx="8" fill="none" stroke="#d4846a" stroke-width="0.6" opacity="0.35"/>
    <text x="16" y="28" font-size="10" fill="#d4846a" opacity="0.5" font-family="Georgia">✦</text>
    <text x="184" y="28" font-size="10" fill="#d4846a" opacity="0.5" font-family="Georgia" text-anchor="end">✦</text>
    <text x="16" y="250" font-size="10" fill="#d4846a" opacity="0.5" font-family="Georgia">✦</text>
    <text x="184" y="250" font-size="10" fill="#d4846a" opacity="0.5" font-family="Georgia" text-anchor="end">✦</text>
    <text x="100" y="32" text-anchor="middle" font-size="9" fill="#d4846a" opacity="0.6" font-family="Georgia" letter-spacing="3">V</text>
    <circle cx="108" cy="128" r="52" fill="none" stroke="#d4846a" stroke-width="1.2" opacity="0.5"/>
    <path d="M108 76 Q156 76 156 128 Q156 180 108 180 Q126 162 126 128 Q126 94 108 76Z" fill="#d4846a" opacity="0.1"/>
    <path d="M108 76 Q60 76 60 128 Q60 180 108 180" fill="none" stroke="#d4846a" stroke-width="1.5" opacity="0.8"/>
    <line x1="50" y1="100" x2="36" y2="90" stroke="#d4846a" stroke-width="0.8" opacity="0.4"/>
    <line x1="40" y1="122" x2="24" y2="118" stroke="#d4846a" stroke-width="0.8" opacity="0.4"/>
    <line x1="44" y1="148" x2="28" y2="156" stroke="#d4846a" stroke-width="0.8" opacity="0.35"/>
    <circle cx="148" cy="92" r="2" fill="#d4846a" opacity="0.55"/>
    <circle cx="162" cy="112" r="1.5" fill="#d4846a" opacity="0.45"/>
    <circle cx="162" cy="148" r="1.5" fill="#d4846a" opacity="0.4"/>
    <circle cx="148" cy="168" r="2" fill="#d4846a" opacity="0.45"/>
    <circle cx="40" cy="85" r="1.5" fill="#d4846a" opacity="0.5"/>
    <circle cx="25" cy="105" r="1" fill="#d4846a" opacity="0.4"/>
    <circle cx="22" cy="150" r="1.5" fill="#d4846a" opacity="0.4"/>
    <path d="M88 116 Q100 104 112 116 Q100 128 88 116Z" fill="#d4846a" opacity="0.2"/>
    <path d="M94 112 Q100 108 106 112" fill="none" stroke="#d4846a" stroke-width="1" opacity="0.4"/>
    <line x1="20" y1="238" x2="180" y2="238" stroke="#d4846a" stroke-width="0.5" opacity="0.35"/>
    <text x="100" y="252" text-anchor="middle" font-size="10" fill="#d4846a" font-family="Georgia" letter-spacing="1">관심-숨김형</text>
  </svg>`,

  // 균열-위기형: 갈라지는 금
  crisis: `<svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="260" rx="12" fill="#1e0a0a" stroke="#c96060" stroke-width="1.5"/>
    <rect x="8" y="8" width="184" height="244" rx="8" fill="none" stroke="#c96060" stroke-width="0.6" opacity="0.35"/>
    <text x="16" y="28" font-size="10" fill="#c96060" opacity="0.5" font-family="Georgia">✦</text>
    <text x="184" y="28" font-size="10" fill="#c96060" opacity="0.5" font-family="Georgia" text-anchor="end">✦</text>
    <text x="16" y="250" font-size="10" fill="#c96060" opacity="0.5" font-family="Georgia">✦</text>
    <text x="184" y="250" font-size="10" fill="#c96060" opacity="0.5" font-family="Georgia" text-anchor="end">✦</text>
    <text x="100" y="32" text-anchor="middle" font-size="9" fill="#c96060" opacity="0.6" font-family="Georgia" letter-spacing="3">VI</text>
    <circle cx="100" cy="128" r="58" fill="none" stroke="#c96060" stroke-width="0.6" opacity="0.18"/>
    <circle cx="100" cy="128" r="44" fill="none" stroke="#c96060" stroke-width="0.4" opacity="0.12"/>
    <path d="M100 68 L96 96 L108 112 L98 128 L90 146 L104 162 L96 200" fill="none" stroke="#c96060" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
    <path d="M96 96 L76 90 L62 96" fill="none" stroke="#c96060" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
    <path d="M108 112 L126 106 L140 112" fill="none" stroke="#c96060" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
    <path d="M98 128 L80 124" fill="none" stroke="#c96060" stroke-width="0.8" stroke-linecap="round" opacity="0.5"/>
    <path d="M90 146 L70 152 L60 146" fill="none" stroke="#c96060" stroke-width="0.8" stroke-linecap="round" opacity="0.5"/>
    <path d="M104 162 L120 170" fill="none" stroke="#c96060" stroke-width="0.7" stroke-linecap="round" opacity="0.45"/>
    <circle cx="108" cy="112" r="2.5" fill="#c96060" opacity="0.8"/>
    <circle cx="98" cy="128" r="2" fill="#c96060" opacity="0.75"/>
    <circle cx="104" cy="162" r="2" fill="#c96060" opacity="0.65"/>
    <circle cx="96" cy="96" r="1.5" fill="#c96060" opacity="0.7"/>
    <line x1="20" y1="238" x2="180" y2="238" stroke="#c96060" stroke-width="0.5" opacity="0.35"/>
    <text x="100" y="252" text-anchor="middle" font-size="10" fill="#c96060" font-family="Georgia" letter-spacing="1">균열-위기형</text>
  </svg>`,

  // 의존-보호형: 돔+별
  dependent: `<svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="260" rx="12" fill="#0a1030" stroke="#6080cc" stroke-width="1.5"/>
    <rect x="8" y="8" width="184" height="244" rx="8" fill="none" stroke="#6080cc" stroke-width="0.6" opacity="0.35"/>
    <text x="16" y="28" font-size="10" fill="#6080cc" opacity="0.5" font-family="Georgia">✦</text>
    <text x="184" y="28" font-size="10" fill="#6080cc" opacity="0.5" font-family="Georgia" text-anchor="end">✦</text>
    <text x="16" y="250" font-size="10" fill="#6080cc" opacity="0.5" font-family="Georgia">✦</text>
    <text x="184" y="250" font-size="10" fill="#6080cc" opacity="0.5" font-family="Georgia" text-anchor="end">✦</text>
    <text x="100" y="32" text-anchor="middle" font-size="9" fill="#6080cc" opacity="0.6" font-family="Georgia" letter-spacing="3">VII</text>
    <path d="M38 148 Q100 72 162 148" fill="none" stroke="#6080cc" stroke-width="2" stroke-linecap="round" opacity="0.75"/>
    <path d="M44 148 Q100 80 156 148" fill="#6080cc" opacity="0.06"/>
    <path d="M58 148 Q100 94 142 148" fill="none" stroke="#6080cc" stroke-width="1" opacity="0.35"/>
    <path d="M72 148 Q100 108 128 148" fill="none" stroke="#6080cc" stroke-width="0.7" opacity="0.25"/>
    <path d="M94 126 L100 112 L106 126 L122 128 L110 138 L114 154 L100 144 L86 154 L90 138 L78 128Z" fill="#6080cc" opacity="0.55"/>
    <line x1="38" y1="148" x2="162" y2="148" stroke="#6080cc" stroke-width="1" opacity="0.4"/>
    <line x1="28" y1="102" x2="20" y2="90" stroke="#6080cc" stroke-width="0.8" opacity="0.35" stroke-dasharray="3,3"/>
    <line x1="40" y1="82" x2="32" y2="68" stroke="#6080cc" stroke-width="0.8" opacity="0.3" stroke-dasharray="3,3"/>
    <line x1="172" y1="102" x2="180" y2="90" stroke="#6080cc" stroke-width="0.8" opacity="0.35" stroke-dasharray="3,3"/>
    <line x1="160" y1="82" x2="168" y2="68" stroke="#6080cc" stroke-width="0.8" opacity="0.3" stroke-dasharray="3,3"/>
    <circle cx="24" cy="88" r="2" fill="#6080cc" opacity="0.5"/>
    <circle cx="36" cy="66" r="1.5" fill="#6080cc" opacity="0.4"/>
    <circle cx="176" cy="88" r="2" fill="#6080cc" opacity="0.5"/>
    <circle cx="164" cy="66" r="1.5" fill="#6080cc" opacity="0.4"/>
    <line x1="20" y1="238" x2="180" y2="238" stroke="#6080cc" stroke-width="0.5" opacity="0.35"/>
    <text x="100" y="252" text-anchor="middle" font-size="10" fill="#6080cc" font-family="Georgia" letter-spacing="1">의존-보호형</text>
  </svg>`,

  // 독립-거리형: 고독한 행성
  independent: `<svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="260" rx="12" fill="#101010" stroke="#909090" stroke-width="1.5"/>
    <rect x="8" y="8" width="184" height="244" rx="8" fill="none" stroke="#909090" stroke-width="0.6" opacity="0.35"/>
    <text x="16" y="28" font-size="10" fill="#909090" opacity="0.5" font-family="Georgia">✦</text>
    <text x="184" y="28" font-size="10" fill="#909090" opacity="0.5" font-family="Georgia" text-anchor="end">✦</text>
    <text x="16" y="250" font-size="10" fill="#909090" opacity="0.5" font-family="Georgia">✦</text>
    <text x="184" y="250" font-size="10" fill="#909090" opacity="0.5" font-family="Georgia" text-anchor="end">✦</text>
    <text x="100" y="32" text-anchor="middle" font-size="9" fill="#909090" opacity="0.6" font-family="Georgia" letter-spacing="3">VIII</text>
    <circle cx="100" cy="128" r="26" fill="none" stroke="#909090" stroke-width="1.4" opacity="0.65"/>
    <circle cx="100" cy="128" r="18" fill="#909090" opacity="0.07"/>
    <ellipse cx="100" cy="128" rx="48" ry="14" fill="none" stroke="#909090" stroke-width="0.9" opacity="0.38" transform="rotate(-22 100 128)"/>
    <circle cx="48" cy="82" r="1.5" fill="#909090" opacity="0.5"/>
    <circle cx="68" cy="68" r="1" fill="#909090" opacity="0.4"/>
    <circle cx="148" cy="74" r="1.5" fill="#909090" opacity="0.5"/>
    <circle cx="162" cy="96" r="1" fill="#909090" opacity="0.4"/>
    <circle cx="38" cy="118" r="1" fill="#909090" opacity="0.35"/>
    <circle cx="162" cy="140" r="1" fill="#909090" opacity="0.35"/>
    <circle cx="52" cy="178" r="1.5" fill="#909090" opacity="0.4"/>
    <circle cx="158" cy="176" r="1" fill="#909090" opacity="0.4"/>
    <line x1="48" y1="82" x2="74" y2="108" stroke="#909090" stroke-width="0.5" opacity="0.2" stroke-dasharray="4,5"/>
    <line x1="148" y1="74" x2="126" y2="108" stroke="#909090" stroke-width="0.5" opacity="0.2" stroke-dasharray="4,5"/>
    <circle cx="100" cy="128" r="5" fill="#909090" opacity="0.45"/>
    <circle cx="100" cy="128" r="2" fill="#909090" opacity="0.7"/>
    <line x1="20" y1="238" x2="180" y2="238" stroke="#909090" stroke-width="0.5" opacity="0.35"/>
    <text x="100" y="252" text-anchor="middle" font-size="10" fill="#909090" font-family="Georgia" letter-spacing="1">독립-거리형</text>
  </svg>`,

  // 혼합-갈등형: 태양+달 음양
  mixed: `<svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="260" rx="12" fill="#1a1210" stroke="#c9a84c" stroke-width="1.5"/>
    <rect x="8" y="8" width="184" height="244" rx="8" fill="none" stroke="#c9a84c" stroke-width="0.6" opacity="0.35"/>
    <text x="16" y="28" font-size="10" fill="#c9a84c" opacity="0.5" font-family="Georgia">✦</text>
    <text x="184" y="28" font-size="10" fill="#c9a84c" opacity="0.5" font-family="Georgia" text-anchor="end">✦</text>
    <text x="16" y="250" font-size="10" fill="#c9a84c" opacity="0.5" font-family="Georgia">✦</text>
    <text x="184" y="250" font-size="10" fill="#c9a84c" opacity="0.5" font-family="Georgia" text-anchor="end">✦</text>
    <text x="100" y="32" text-anchor="middle" font-size="9" fill="#c9a84c" opacity="0.6" font-family="Georgia" letter-spacing="3">IX</text>
    <path d="M100 128 Q100 76 58 76 Q16 76 16 128Z" fill="#c9a84c" opacity="0.12"/>
    <path d="M100 128 Q58 128 58 76 Q58 48 100 48 Q142 48 142 76 Q142 104 100 128Z" fill="none" stroke="#c9a84c" stroke-width="1.4" opacity="0.7"/>
    <path d="M100 128 Q100 180 142 180 Q184 180 184 128Z" fill="#c96060" opacity="0.09"/>
    <path d="M100 128 Q142 128 142 180 Q142 208 100 208 Q58 208 58 180 Q58 152 100 128Z" fill="none" stroke="#c96060" stroke-width="1.4" opacity="0.7"/>
    <line x1="100" y1="38" x2="100" y2="26" stroke="#c9a84c" stroke-width="0.9" opacity="0.45"/>
    <line x1="72" y1="44" x2="66" y2="34" stroke="#c9a84c" stroke-width="0.9" opacity="0.38"/>
    <line x1="48" y1="62" x2="40" y2="55" stroke="#c9a84c" stroke-width="0.9" opacity="0.38"/>
    <line x1="128" y1="44" x2="134" y2="34" stroke="#c9a84c" stroke-width="0.9" opacity="0.38"/>
    <line x1="152" y1="62" x2="160" y2="55" stroke="#c9a84c" stroke-width="0.9" opacity="0.38"/>
    <circle cx="72" cy="190" r="2" fill="#c96060" opacity="0.45"/>
    <circle cx="56" cy="176" r="1.5" fill="#c96060" opacity="0.38"/>
    <circle cx="50" cy="158" r="1" fill="#c96060" opacity="0.32"/>
    <circle cx="100" cy="128" r="5.5" fill="none" stroke="#c9a84c" stroke-width="0.9" opacity="0.8"/>
    <circle cx="100" cy="128" r="2.5" fill="#c9a84c" opacity="0.7"/>
    <line x1="20" y1="238" x2="180" y2="238" stroke="#c9a84c" stroke-width="0.5" opacity="0.35"/>
    <text x="100" y="252" text-anchor="middle" font-size="10" fill="#c9a84c" font-family="Georgia" letter-spacing="1">혼합-갈등형</text>
  </svg>`
}

function getTarotSvg(typeName: string): string {
  if (!typeName) return TAROT_SVGS['anxious']
  const t = typeName
  if (t.includes('불안') || t.includes('집착')) return TAROT_SVGS['anxious']
  if (t.includes('회피') || t.includes('냉각') || t.includes('차갑') || t.includes('거리')) return TAROT_SVGS['avoidant']
  if (t.includes('안정') || t.includes('신뢰') || t.includes('건강')) return TAROT_SVGS['stable']
  if (t.includes('반복') || t.includes('구조') || t.includes('순환')) return TAROT_SVGS['repeat']
  if (t.includes('숨') || t.includes('관심') || t.includes('망설') || t.includes('조심')) return TAROT_SVGS['hidden']
  if (t.includes('균열') || t.includes('위기') || t.includes('갈등') || t.includes('혼란')) return TAROT_SVGS['crisis']
  if (t.includes('의존') || t.includes('보호') || t.includes('집착')) return TAROT_SVGS['dependent']
  if (t.includes('독립') || t.includes('자유') || t.includes('혼자')) return TAROT_SVGS['independent']
  if (t.includes('혼합') || t.includes('복합') || t.includes('이중')) return TAROT_SVGS['mixed']
  return TAROT_SVGS['anxious']
}

export default function ResultPage() {
  const router = useRouter()
  const [resultText, setResultText] = useState('')
  const [quizType, setQuizType] = useState<string>(() => {
    if (typeof window !== 'undefined') return sessionStorage.getItem('quiz_type') || 'attachment'
    return 'attachment'
  })
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const shareCardRef = useRef<HTMLDivElement>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  useEffect(() => {
    const type = sessionStorage.getItem('quiz_type') || 'attachment'
    const stored = sessionStorage.getItem('result_text')
    setQuizType(type)
    if (stored) { setResultText(stored); setLoading(false); return }
    const answers = JSON.parse(sessionStorage.getItem('quiz_answers') || '[]')
    fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizType: type, answers }),
    }).then(async res => {
      if (!res.ok) { showToast('오류가 발생했어요'); setLoading(false); return }
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let fullText = ''
      setLoading(false)
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullText += decoder.decode(value)
        setResultText(fullText)
      }
      localStorage.setItem('free_result_date', new Date().toLocaleDateString('ko-KR'))
    }).catch(() => { showToast('오류가 발생했어요'); setLoading(false) })
  }, [])

  function parseResult(raw: string) {
    const parts = raw.split(/\[([^\]]+)\]/g).filter(s => s.trim())
    const sections: { title: string; body: string }[] = []
    for (let i = 0; i < parts.length; i += 2) {
      const title = parts[i]?.trim()
      const body = parts[i + 1]?.trim()
      if (title && body) sections.push({ title, body })
    }
    return sections.length ? sections : [{ title: '분석 결과', body: raw }]
  }

  function extractTypeName(text: string): string {
    if (!text) return ''
    const patterns = [
      /당신은\s+([가-힣]+-[가-힣]+형|[가-힣]+형)/,
      /당신의 전 애인은\s+([가-힣]+-[가-힣]+형|[가-힣]+형)/,
      /당신의 이상형은\s+([가-힣]+-[가-힣]+형|[가-힣]+형)/,
      /그 사람은\s+([가-힣]+-[가-힣]+형|[가-힣]+형)/,
      /우리 관계는\s+([가-힣]+-[가-힣]+형|[가-힣]+형)/,
    ]
    for (const p of patterns) {
      const m = text.match(p)
      if (m) return m[1]
    }
    const m = text.split('\n')[0].match(/([가-힣]+-[가-힣]+형|[가-힣]+형)/)
    return m ? m[1] : ''
  }

  function copyLink() {
    const url = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
    navigator.clipboard.writeText(url)
      .then(() => showToast('링크가 복사됐어요! 카톡에 붙여넣기 해보세요 🔮'))
      .catch(() => showToast('복사에 실패했어요'))
  }

  async function captureShareCard() {
    const el = shareCardRef.current
    if (!el) return
    showToast('카드 생성 중...')
    try {
      const canvas = await html2canvas(el, { backgroundColor: '#141428', scale: 3, useCORS: true, logging: false })
      const image = canvas.toDataURL('image/png')
      if (navigator.share) {
        const blob = await (await fetch(image)).blob()
        await navigator.share({ title: '연애 심리 분석 결과', files: [new File([blob], 'love-lab-card.png', { type: 'image/png' })] })
      } else {
        const link = document.createElement('a')
        link.download = 'love-lab-card.png'
        link.href = image
        link.click()
        showToast('카드가 저장됐어요!')
      }
    } catch (e: any) { if (e.name !== 'AbortError') showToast('저장 중 오류가 발생했어요') }
  }

  const typeColors: Record<string, string> = {
    attachment: '#c9a84c', pattern: '#a087cc', ideal: '#84b4cc',
    ex: '#cc84a0', crush: '#e8a87c', couple: '#84cca4'
  }

  const quiz = QUIZZES[quizType]
  const sections = parseResult(resultText)
  const typeName = extractTypeName(resultText)
  const tc = typeColors[quizType] || '#c9a84c'
  const tarotSvg = getTarotSvg(typeName)

  return (
    <>
      <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', gap: 14, position: 'sticky', top: 0, background: '#141428', zIndex: 10 }}>
        <button className="back-btn" onClick={() => router.push('/')}>‹</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: 2 }}>{quiz?.cat}</div>
          <div style={{ fontSize: 12.5, color: 'rgba(240,234,216,0.5)', fontWeight: 300 }}>분석 결과</div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '20px 24px 5rem', overflowY: 'auto' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 20 }}>
            <div className="spinner" />
            <div style={{ fontSize: 13.5, color: 'rgba(240,234,216,0.5)', fontWeight: 300, textAlign: 'center', lineHeight: 1.7 }}>
              답변을 분석하고 있어요<br />
              <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>잠시만 기다려주세요...</em>
            </div>
          </div>
        ) : (
          <div className="fade-up">
            {/* 타로카드 스타일 유형 카드 */}
            <div ref={shareCardRef} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '24px 20px 20px',
              background: 'linear-gradient(160deg, #1e1b38 0%, #141428 100%)',
              border: `1px solid ${tc}40`,
              borderRadius: 20, marginBottom: 28, textAlign: 'center',
            }}>
              <div style={{ fontSize: 10, letterSpacing: '0.18em', color: `${tc}bb`, border: `1px solid ${tc}30`, borderRadius: 20, padding: '3px 14px', display: 'inline-block', marginBottom: 18 }}>
                {quiz?.cat}
              </div>
              {/* 타로카드 SVG */}
              <div style={{ width: 140, height: 182, marginBottom: 18, filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))' }}
                dangerouslySetInnerHTML={{ __html: tarotSvg }} />
              {/* 유형 이름 */}
              {typeName ? (
                <div style={{ fontFamily: 'Noto Serif KR, serif', fontSize: '1.65rem', fontWeight: 700, color: '#f0ead8', letterSpacing: '0.04em', marginBottom: 6, lineHeight: 1.2 }}>
                  {typeName}
                </div>
              ) : (
                <div style={{ fontSize: 13, color: 'rgba(240,234,216,0.35)', marginBottom: 6 }}>분석 중...</div>
              )}
              <div style={{ width: 24, height: 1.5, background: `${tc}60`, margin: '0 auto 14px', borderRadius: 2 }} />
              <button onClick={captureShareCard} style={{
                background: `${tc}18`, border: `1px solid ${tc}45`, borderRadius: 10,
                padding: '7px 20px', fontSize: 12, color: `${tc}dd`,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>✨ 카드 저장하기</button>
              <div style={{ fontSize: 9, color: 'rgba(240,234,216,0.18)', marginTop: 12, letterSpacing: '0.12em', fontFamily: 'Georgia' }}>love-lab.kr</div>
            </div>

            {/* 분석 본문 */}
            {sections.map((s, i) => (
              <div key={i} className="rs-section">
                <div className="rs-sep"><span className="rs-label">분석</span><div className="rs-sep-line" /></div>
                <div className="rs-title">{s.title}</div>
                <div className="rs-body">{s.body}</div>
              </div>
            ))}

            {/* 공유 */}
            <div style={{ marginTop: 32, background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 16, padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#f0ead8', marginBottom: 6 }}>친구와 공유하기</div>
              <div style={{ fontSize: 13, color: 'rgba(240,234,216,0.5)', marginBottom: 16, lineHeight: 1.6 }}>나도 분석해보라고 링크를 보내봐요 🔮</div>
              <button onClick={copyLink} style={{
                width: '100%', height: 48,
                background: 'linear-gradient(135deg, #b8922e, #e8c96a)',
                border: 'none', borderRadius: 12,
                fontSize: 14, fontWeight: 700, color: '#1a1410',
                cursor: 'pointer', fontFamily: 'inherit',
              }}>🔗 링크 복사하기</button>
            </div>
          </div>
        )}
      </div>

      {!loading && (
        <div style={{ padding: '0 20px 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn-gold" style={{ height: 52, fontSize: 15 }}
            onClick={() => { sessionStorage.removeItem('result_text'); sessionStorage.removeItem('quiz_answers'); router.push(`/quiz/${quizType}`) }}>
            다시 분석하기
          </button>
          <button className="btn-ghost" onClick={() => router.push('/')}>처음으로 돌아가기</button>
        </div>
      )}
      <div className={`toast ${toast ? 'on' : ''}`}>{toast}</div>
    </>
  )
}
