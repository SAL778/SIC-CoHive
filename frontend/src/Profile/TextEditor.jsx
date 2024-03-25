import { useState, useEffect } from "react";
import { RichTextEditor } from '@mantine/tiptap';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { TextAlign } from '@tiptap/extension-text-align';
import "./textEditor.css";

export function TextEditor({ initialValue, onValueSubmit, readOnly}) {

    const [lastEdited, setLastEdited] = useState(initialValue) //Used to hide save button until change
    const editor = useEditor({
        editable: !readOnly,
        extensions: [
            StarterKit,
            Placeholder.configure(
              {placeholder: () => (
                readOnly ? 'No description' : 'Enter a brief description'
              ),
              showOnlyWhenEditable: false,
              }),
            TextAlign.configure({types: ['heading', 'paragraph']}),  //Text align only applies to these elements
        ],
        content: initialValue
    })

    return (
            <div className = "relative px-[10px]">
              <RichTextEditor editor={editor}>
                {!readOnly &&
                  <RichTextEditor.Toolbar sticky className="editor-header gap-8 min-h-[70px]">
                    <RichTextEditor.ControlsGroup className="headings">
                      <RichTextEditor.H1 icon={() => <i className="fa fa-heading text-xl"/>}/>
                      <RichTextEditor.H2 icon={() => <i className="fa fa-heading text-md"/>}/>
                      <RichTextEditor.H3 icon={() => <i className="fa fa-heading text-sm"/>}/>
                    </RichTextEditor.ControlsGroup>
        
                    <RichTextEditor.ControlsGroup className="textModifiers">
                      <RichTextEditor.Bold icon={() => <i className="fa fa-bold text-xl"/>} />
                      <RichTextEditor.Italic icon={() => <i className="fa fa-italic text-xl"/>} />
                      <RichTextEditor.Code icon={() => <i className="fa fa-code text-xl"/>}/>
                      <RichTextEditor.ClearFormatting icon={() => <i className="fa fa-broom text-xl"/>} />
                    </RichTextEditor.ControlsGroup>
        
                    <RichTextEditor.ControlsGroup className="structures">
                      <RichTextEditor.Blockquote icon={() => <i className="fa fa-quote-left text-xl"/>}/>
                      <RichTextEditor.Hr icon={() => <i className="fa fa-left-right text-xl"/>}/>
                      <RichTextEditor.BulletList icon={() => <i className="fa fa-list text-xl"/>}/>
                    </RichTextEditor.ControlsGroup>
        
                    <RichTextEditor.ControlsGroup className="textAlignment">
                      <RichTextEditor.AlignLeft icon={() => <i className="fa fa-align-left text-xl"/>}/>
                      <RichTextEditor.AlignCenter icon={() => <i className="fa fa-align-center text-xl"/>}/>
                      <RichTextEditor.AlignRight icon={() => <i className="fa fa-align-right text-xl"/>}/>
                    </RichTextEditor.ControlsGroup>
        
                    <RichTextEditor.ControlsGroup className="controls">
                      <RichTextEditor.Undo icon={() => <i className="fa fa-rotate-left text-xl"/>}/>
                      <RichTextEditor.Redo icon={() => <i className="fa fa-rotate-right text-xl"/>}/>
                    </RichTextEditor.ControlsGroup>
                  </RichTextEditor.Toolbar>
                }
                <RichTextEditor.Content />
              </RichTextEditor>
      
              {/* Only show the save button when value has been changed and editor has been loaded */}
              { (!readOnly && editor && editor.getHTML() !== lastEdited) &&
                <button 
                type="button" 
                className="button-orange absolute bottom-4 right-[42px] shadow-custom"
                onClick={() => {
                  setLastEdited(editor.getHTML()); //Remove save button to limit backend spam
                  onValueSubmit(editor.getHTML());
                }}>
                  Save Content
                </button>
              }
            </div>
          )
}