import { Form, LoaderFunction, useLoaderData } from 'remix';
import { useTransition, useActionData, redirect, Form } from 'remix';
import type { ActionFunction } from 'remix';
import { createPost, getPost, Post } from '~/post';

import invariant from 'tiny-invariant';

type PostError = {
    title?: boolean;
    slug?: boolean;
    markdown?: boolean;
};

export const loader: LoaderFunction = async ({ params }) => {
    console.log('edit loader params:', params);
    invariant(params.slug, 'expected params.slug');
    return getPost(params.slug);
};

export const action: ActionFunction = async ({ request }) => {
    await new Promise((res) => setTimeout(res, 1000));
    const formData = await request.formData();

    const title = formData.get('title');
    const slug = formData.get('slug');
    const markdown = formData.get('markdown');

    const errors: PostError = {};
    if (!title) errors.title = true;
    if (!slug) errors.slug = true;
    if (!markdown) errors.markdown = true;

    console.log('errors:', errors);

    if (Object.keys(errors).length) {
        return errors;
    }

    invariant(typeof title === 'string');
    invariant(typeof slug === 'string');
    invariant(typeof markdown === 'string');
    await createPost({ title, slug, markdown });

    return redirect('/admin');
};

export default function EditPost() {
    const post = useLoaderData();
    console.log('EditPost post:', post);
    const errors = useActionData();
    const transition = useTransition();
    return (
        <Form method="post">
            <p>
                <label>
                    Post Title: {errors?.title ? <em>Title is required</em> : null}
                    <input type="text" name="title" defaultValue={post.title} />
                </label>
            </p>
            <p>
                <label>
                    Post Slug: {errors?.slug ? <em>Slug is required</em> : null}
                    <input type="text" name="slug" defaultValue={post.slug} />
                </label>
            </p>
            <p>
                <label htmlFor="markdown">Markdown:</label> {errors?.markdown ? <em>Markdown is required</em> : null}
                <br />
                <textarea id="markdown" rows={20} name="markdown" defaultValue={post.markdown} />
            </p>
            <p>
                <button type="submit"> {transition.submission ? 'Editing...' : 'Edit Post'}</button>
            </p>
        </Form>
    );
}
