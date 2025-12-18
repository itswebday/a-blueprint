import { getLocale, getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";
import RichTextRenderer from "@/components/RichTextRenderer";
import { DEFAULT_LOCALE } from "@/constants";
import type { Config } from "@/payload-types";
import type { LocaleOption, RichText } from "@/types";
import BlogPostClient from "./BlogPostClient";
import BlogSidebar from "./BlogSidebar";

type BlogPostProps = {
  blogPost: Config["collections"]["blog-posts"];
  allBlogPosts: Config["collections"]["blog-posts"][];
};

const BlogPost = async ({ blogPost, allBlogPosts }: BlogPostProps) => {
  const locale = (await getLocale()) as LocaleOption;
  const blogT = await getTranslations("blog");

  // Image
  const image =
    typeof blogPost.image === "object" &&
    blogPost.image !== null &&
    "url" in blogPost.image
      ? blogPost.image
      : null;

  // Published date
  const publishedDate = blogPost.publishedAt
    ? new Date(blogPost.publishedAt).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  // Rendered content
  const renderedContent = blogPost.content ? (
    <RichTextRenderer
      className="leading-relaxed"
      richText={blogPost.content as RichText}
    />
  ) : null;

  // Related posts
  const relatedPosts = allBlogPosts
    .filter((post) => post.slug !== blogPost.slug)
    .slice(0, 3)
    .map((post) => {
      const postImage =
        typeof post.image === "object" &&
        post.image !== null &&
        "url" in post.image
          ? post.image
          : null;
      const postPublishedDate = post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString(locale, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : null;

      // Post href
      const postHref =
        post.url ||
        `${
          locale === DEFAULT_LOCALE ? "" : `/${locale}`
        }/blog/${post.slug || ""}`;

      // Rendered title
      const renderedTitle = <>{post.title}</>;

      // Rendered date
      const renderedDate = postPublishedDate ? <>{postPublishedDate}</> : null;

      // Rendered min read
      const renderedMinRead = post.minRead ? (
        <>
          {post.minRead} {blogT("minRead")}
        </>
      ) : null;

      // Return related post
      return {
        id: post.id,
        title: post.title,
        href: postHref,
        image: postImage,
        publishedDate: postPublishedDate,
        minRead: post.minRead,
        renderedTitle: renderedTitle,
        renderedDate: renderedDate,
        renderedMinRead: renderedMinRead,
      };
    });

  return (
    <section className={twMerge("w-full py-12", "de:py-20")}>
      {/* Container */}
      <div
        className={twMerge(
          "flex flex-col gap-8 w-11/12 max-w-7xl mx-auto",
          "me:flex-row me:gap-12",
        )}
      >
        {/* Content */}
        <article className="flex-1">
          <BlogPostClient
            className={twMerge(
              "w-full overflow-hidden rounded-3xl border-2 border-gray-100",
              "bg-white shadow-lg shadow-gray-100/50 transition-all",
              "duration-300 hover:shadow-xl hover:shadow-gray-200/50",
            )}
            image={image}
            publishedDate={publishedDate}
            minRead={blogPost.minRead}
            minReadText={blogT("minRead")}
            renderedContent={renderedContent}
            publishedOnText={blogT("publishedOn")}
            publishedAt={blogPost.publishedAt}
          />
        </article>

        {/* Sidebar */}
        <aside className="w-full h-fit max-w-120 mx-auto shrink-0 me:w-100">
          <BlogSidebar
            relatedPosts={relatedPosts}
            headingText={blogT("sideBar.heading")}
            paragraphText={blogT("sideBar.paragraph")}
            noPostsText={blogT("noPosts")}
          />
        </aside>
      </div>
    </section>
  );
};

export default BlogPost;
