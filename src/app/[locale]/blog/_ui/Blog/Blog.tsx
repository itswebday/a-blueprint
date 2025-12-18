import { getLocale, getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";
import type { Blog as BlogType, BlogPost } from "@/payload-types";
import type { LocaleOption } from "@/types";
import { getMediaUrlAndAlt } from "@/utils";
import BlogClient from "./BlogClient";

type BlogProps = {
  blog: BlogType;
  blogPosts: BlogPost[];
};

const Blog: React.FC<BlogProps> = async ({ blog, blogPosts }) => {
  const locale = (await getLocale()) as LocaleOption;
  const blogT = await getTranslations("blog");

  return (
    <section className="w-full py-12 de:py-20">
      {/* Container */}
      <div className="w-11/12 max-w-7xl mx-auto">
        {/* Heading and paragraph */}
        <header className={twMerge("mb-12 text-center", "de:mb-16")}>
          {/* Heading */}
          <h1
            className={twMerge(
              "mb-4 text-[28px] font-bold text-dark",
              "de:text-[36px]",
            )}
          >
            {blog.heading}
          </h1>

          {/* Paragraph */}
          <p
            className={twMerge(
              "mx-auto max-w-2xl text-[15px] text-dark/70",
              "de:text-[16px]",
            )}
          >
            {blog.paragraph}
          </p>
        </header>

        {/* Blog posts */}
        {blogPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-dark/60">{blogT("noPosts")}</p>
          </div>
        ) : (
          <BlogClient
            blogPosts={blogPosts.map((post) => {
              const { url: imageURL, alt: imageAlt } = getMediaUrlAndAlt(
                post.image,
              );

              return {
                id: post.id,
                slug: post.slug,
                url: post.url,
                imageURL: imageURL,
                imageAlt: imageAlt,
                title: post.title,
                publishedAt: post.publishedAt,
                description: post.meta?.description,
              };
            })}
            locale={locale}
            readMoreText={blogT("readMore")}
            formattedDates={blogPosts.map((post) =>
              post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : null,
            )}
          />
        )}
      </div>
    </section>
  );
};

export default Blog;
