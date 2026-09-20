import {
  Children,
  cloneElement,
  isValidElement,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

export const cinematicEase = [0.19, 1, 0.22, 1] as const;
type NodeProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  [key: string]: unknown;
};

function words(children: ReactNode, order: { value: number }): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === "string") {
      return child.split(/(\s+)/).map((word, i) =>
        /^\s*$/.test(word) ? (
          word
        ) : (
          <span className="reveal-word-mask" key={i}>
            <span
              className="reveal-word"
              style={
                {
                  "--word-delay": `${Math.min(order.value++, 18) * 0.026}s`,
                } as CSSProperties
              }
            >
              {word}
            </span>
          </span>
        ),
      );
    }
    if (
      isValidElement<NodeProps>(child) &&
      typeof child.type === "string" &&
      child.type !== "br"
    ) {
      return cloneElement(child, {}, words(child.props.children, order));
    }
    return child;
  });
}

// Keep the original headings, emphasis, whitespace and explicit line breaks.
export function sequenceContent(children: ReactNode): ReactNode {
  const order = { value: 0 };
  function visit(nodes: ReactNode): ReactNode {
    return Children.map(nodes, (child) => {
      if (!isValidElement<NodeProps>(child) || typeof child.type !== "string")
        return child;
      const name = child.type;
      const className = child.props.className || "";
      if (/^h[123]$/.test(name)) {
        return cloneElement(
          child,
          { "data-reveal-heading": "" },
          words(child.props.children, order),
        );
      }
      const phase = className.includes("eyebrow")
        ? "meta"
        : name === "p"
          ? "body"
          : /deliverable|process-tile-image|process-number/.test(className)
            ? "detail"
            : undefined;
      return cloneElement(
        child,
        phase ? { "data-reveal-item": phase } : {},
        visit(child.props.children),
      );
    });
  }
  return visit(children);
}
