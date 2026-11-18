import { useState } from 'react'
import type { Post } from '../types'

interface BlogCardProps {
  post: Post
}

export default function BlogCard({ post }: BlogCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const contentId = `post-content-${post.id}`

  return (
    <article className="card">
      <h3 className="font-bold text-c4-blue-dark mb-2">{post.titulo}</h3>
      <p className="mb-4 text-sm text-slate-500">{post.resumo}</p>
      {isExpanded && (
        <div id={contentId} className="mb-4 space-y-3 text-sm leading-relaxed text-slate-600">
          {post.conteudo.map((paragrafo) => (
            <p key={paragrafo}>{paragrafo}</p>
          ))}
        </div>
      )}
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={contentId}
        onClick={() => setIsExpanded((expanded) => !expanded)}
        className="text-sm font-semibold text-c4-red hover:underline"
      >
        {isExpanded ? 'Leia menos ↑' : 'Leia mais →'}
      </button>
    </article>
  )
}