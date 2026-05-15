import { renderMarkdown } from '@/Utils/Utils';
import { useMemo } from 'react';

/**
 * MarkUpTextRender - Renders markdown content or fallback children
 * Optimized for performance, SEO, and mobile responsiveness
 */
const MarkUpTextRender = ({ markedDesc, children, className = '', lang = 'en' }) => {
  // Memoize rendered HTML to prevent unnecessary re-parsing
  const renderedHtml = useMemo(() => {
    if (!markedDesc) return null;
    try {
      return { __html: renderMarkdown(markedDesc) };
    } catch (error) {
      console.error('Markdown rendering failed:', error);
      return null;
    }
  }, [markedDesc]);

  // Fallback to children if no markdown or rendering failed
  const hasContent = renderedHtml !== null;

  return (
    <article
      className={`
        text-left
        prose 
        prose-invert 
        max-w-none
        text-sm sm:text-base md:text-lg
        leading-relaxed sm:leading-8
        break-words
        overflow-wrap-anywhere
        ${className}
      `.trim()}
      lang={lang}
      role="region"
      aria-label="Content section"
      itemScope
      itemType="https://schema.org/Article"
    >
      {hasContent ? (
        <div
          className="prose-content break-words"
          dangerouslySetInnerHTML={renderedHtml}
          itemProp="articleBody"
          style={{
            fontSize: 'inherit',
            lineHeight: 'inherit',
          }}
        />
      ) : (
        <div className="prose-content" itemProp="articleBody">
          {children}
        </div>
      )}
    </article>
  );
};

MarkUpTextRender.displayName = 'MarkUpTextRender';
export default MarkUpTextRender;
