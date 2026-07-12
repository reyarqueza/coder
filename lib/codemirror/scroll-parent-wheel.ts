import { EditorView } from "@codemirror/view";

function findScrollableParent(element: HTMLElement | null) {
  let el = element?.parentElement ?? null;

  while (el) {
    const { overflowY } = getComputedStyle(el);
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      el.scrollHeight > el.clientHeight
    ) {
      return el;
    }
    el = el.parentElement;
  }

  return null;
}

/** For read-only display editors: scroll the nearest overflow parent on wheel. */
export function scrollParentOnWheelExtension() {
  return EditorView.domEventHandlers({
    wheel(event, view) {
      if (view.scrollDOM.scrollHeight > view.scrollDOM.clientHeight + 1) {
        return false;
      }

      const scrollParent = findScrollableParent(view.dom);
      if (!scrollParent) return false;

      scrollParent.scrollTop += event.deltaY;
      event.preventDefault();
      return true;
    },
  });
}
