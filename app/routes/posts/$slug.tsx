import { useLoaderData } from 'remix'
import type { LoaderFunction } from 'remix'
import invariant from 'tiny-invariant'
import { getPost } from '~/post'

export const loader: LoaderFunction = async ({ params }) => {
    console.log('loader params:', params)
    invariant(params.slug, 'expected params.slug')
    return getPost(params.slug)
}

export default function PostSlug() {
    const post = useLoaderData()
    console.log('post:', post)
    return (
        <div>
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
    )
}
