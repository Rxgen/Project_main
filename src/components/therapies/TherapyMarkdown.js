"use client";

import ReactMarkdown from "react-markdown";

/**
 * @param {object} [props]
 * @param {string} [props.children] markdown source
 * @param {string} [props.className] wrapper class
 * @param {object} [props.components] react-markdown component map (client components only — do not pass from Server Components)
 * @param {boolean} [props.unwrapParagraph] render markdown paragraphs as fragments (for use inside h1/spans)
 * @param {string} [props.paragraphClassName] render markdown paragraphs as span.paragraphClassName (for headings)
 */
export default function TherapyMarkdown({
  children,
  className,
  components: componentsProp,
  unwrapParagraph = false,
  paragraphClassName,
}) {
  if (children == null || children === "") return null;
  const str = typeof children === "string" ? children : String(children);

  const fromProps = {};
  if (paragraphClassName) {
    fromProps.p = ({ children: c }) => (
      <span className={paragraphClassName}>{c}</span>
    );
  } else if (unwrapParagraph) {
    fromProps.p = ({ children: c }) => <>{c}</>;
  }

  const merged = {
    a: ({ href, children: c }) => (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {c}
      </a>
    ),
    ...fromProps,
    ...componentsProp,
  };

  const body = <ReactMarkdown components={merged}>{str}</ReactMarkdown>;
  return className ? <div className={className}>{body}</div> : body;
}
