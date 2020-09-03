import React, {
  useCallback,
  useMemo,
  useState,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { TMemo } from '@shared/components/TMemo';
import { SlateLeaf } from './render/Leaf';
import { SlateElement } from './render/Element';
import { createMsgInputEditor } from './instance';
import { Range, Editor, Transforms } from 'slate';
import { Slate, ReactEditor } from 'slate-react';
import { EditArea } from './render/EditArea';
import { EditorBaseProps, TRPGEditorNode } from './types';
import _isFunction from 'lodash/isFunction';
import {
  isArrowUpHotkey,
  isArrowDownHotkey,
  isTabHotkey,
  isEnterHotkey,
  isEscHotkey,
} from '@web/utils/hot-key';
import { EditorMentionListContext } from './context/EditorMentionListContext';
import ReactDOM from 'react-dom';

const MentionsPortal = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};

interface MsgInputEditorProps extends EditorBaseProps {}
export const MsgInputEditor: React.FC<MsgInputEditorProps> = TMemo((props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const renderElement = useCallback((props) => <SlateElement {...props} />, []);
  const renderLeaf = useCallback((props) => <SlateLeaf {...props} />, []);
  const editor = useMemo(() => createMsgInputEditor(), []);
  const [target, setTarget] = useState<Range | undefined>(undefined);
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState('');
  const mentionList = useContext(EditorMentionListContext);
  const chars = mentionList
    .map((val) => val.text)
    .filter((c) => c.toLowerCase().startsWith(search.toLowerCase()))
    .slice(0, 10);

  const handleChange = useCallback(
    (value: TRPGEditorNode[]) => {
      _isFunction(props.onChange) && props.onChange(value);
      const { selection } = editor;

      if (selection && Range.isCollapsed(selection)) {
        const [start] = Range.edges(selection);
        const wordBefore = Editor.before(editor, start, { unit: 'word' });
        const before = wordBefore && Editor.before(editor, wordBefore);
        const beforeRange = before && Editor.range(editor, before, start);
        const beforeText = beforeRange && Editor.string(editor, beforeRange);
        const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/);
        const after = Editor.after(editor, start);
        const afterRange = Editor.range(editor, start, after);
        const afterText = Editor.string(editor, afterRange);
        const afterMatch = afterText.match(/^(\s|$)/);

        if (beforeMatch && afterMatch) {
          setTarget(beforeRange);
          setSearch(beforeMatch[1]);
          setIndex(0);
          return;
        }
      }

      setTarget(undefined);
    },
    [editor, props.onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (target) {
        if (isArrowUpHotkey(e.nativeEvent)) {
          e.preventDefault();
          const nextIndex = index <= 0 ? chars.length - 1 : index - 1;
          setIndex(nextIndex);
        } else if (isArrowDownHotkey(e.nativeEvent)) {
          e.preventDefault();
          const prevIndex = index >= chars.length - 1 ? 0 : index + 1;
          setIndex(prevIndex);
        } else if (isTabHotkey(e.nativeEvent) || isEnterHotkey(e.nativeEvent)) {
          e.preventDefault();
          Transforms.select(editor, target);
          insertMention(editor, chars[index]);
          setTarget(undefined);
        } else if (isEscHotkey(e.nativeEvent)) {
          e.preventDefault();
          setTarget(undefined);
        }
      }
    },
    [index, search, target]
  );

  useEffect(() => {
    const el = ref.current;
    if (target && el && chars.length > 0) {
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      el.style.top = `${rect.top + window.pageYOffset + 24}px`;
      el.style.left = `${rect.left + window.pageXOffset}px`;
    }
  }, [chars.length, editor, index, search, target]);

  return (
    <Slate editor={editor} value={props.value} onChange={handleChange}>
      <EditArea
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={handleKeyDown}
      />
      {target && chars.length > 0 && (
        <MentionsPortal>
          <div
            ref={ref}
            style={{
              top: '-9999px',
              left: '-9999px',
              position: 'absolute',
              zIndex: 1,
              padding: '3px',
              background: 'white',
              borderRadius: '4px',
              boxShadow: '0 1px 5px rgba(0,0,0,.2)',
            }}
          >
            {chars.map((char, i) => (
              <div
                key={char}
                style={{
                  padding: '1px 3px',
                  borderRadius: '3px',
                  background: i === index ? '#B4D5FF' : 'transparent',
                }}
              >
                {char}
              </div>
            ))}
          </div>
        </MentionsPortal>
      )}
    </Slate>
  );
});
MsgInputEditor.displayName = 'MsgInputEditor';

/**
 * 插入提及
 */
const insertMention = (editor: Editor, character: string) => {
  const mention = { type: 'mention', character, children: [{ text: '' }] };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
};
