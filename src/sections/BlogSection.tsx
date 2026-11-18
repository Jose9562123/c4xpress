import SectionTitle from '../components/SectionTitle'
import BlogCard from '../components/BlogCard'
import { posts } from '../data/posts'

export default function BlogSection() {
  return (
    <section id="blog" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          titulo="Blog"
          subtitulo="Conhecimento e novidades sobre logística e transporte"
        />

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}