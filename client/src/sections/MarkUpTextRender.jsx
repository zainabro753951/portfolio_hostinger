import { renderMarkdown } from '@/Utils/Utils';

const MarkUpTextRender = ({ markedDesc, children }) => {
  return (
    <div
      className="
                text-left
    prose 
    prose-invert 
    max-w-none

    prose-p:text-gray-300
    prose-p:leading-8

    prose-strong:text-white
    prose-strong:font-semibold

    prose-em:text-gray-300

    prose-ul:list-disc
    prose-ul:pl-6
    prose-ul:space-y-3

    prose-ol:list-decimal
    prose-ol:pl-6
    prose-ol:space-y-3

    prose-li:text-gray-300
    prose-li:marker:text-cyan-400

    prose-headings:text-white

    prose-a:text-cyan-400
    prose-a:no-underline
    hover:prose-a:text-cyan-300
  "
    >
      {markedDesc ? (
        // ✅ Case 1: Data available hai -> Render Markdown
        <div
          dangerouslySetInnerHTML={{
            __html: renderMarkdown(markedDesc),
          }}
        />
      ) : (
        // ✅ Case 2: Data nahi hai -> Show Default Content
        children
      )}
    </div>
  );
};

export default MarkUpTextRender;
