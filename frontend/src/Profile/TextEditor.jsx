import { useState, useEffect } from "react";
import { RichTextEditor } from '@mantine/tiptap';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { TextAlign } from '@tiptap/extension-text-align';

export function TextEditor({ initialValue, onValueSubmit }) {

    const placeholder = "Fill in a brief description"
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({placeholder: placeholder}),
            TextAlign.configure({types: ['heading', 'paragraph']})  //Text align only applies to these elements
        ],
        content: initialValue
    })

    return (
            <div>
              <RichTextEditor editor={editor}>
                <RichTextEditor.Toolbar sticky>
                  <RichTextEditor.ControlsGroup className="headings">
                    <RichTextEditor.H1 />
                    <RichTextEditor.H2 />
                    <RichTextEditor.H3 />
                  </RichTextEditor.ControlsGroup>
      
                  <RichTextEditor.ControlsGroup className="textModifiers">
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Code />
                    <RichTextEditor.ClearFormatting />
                  </RichTextEditor.ControlsGroup>
      
                  <RichTextEditor.ControlsGroup className="structures">
                    <RichTextEditor.Blockquote />
                    <RichTextEditor.Hr />
                    <RichTextEditor.BulletList />
                  </RichTextEditor.ControlsGroup>
      
                  <RichTextEditor.ControlsGroup className="textAlignment">
                    <RichTextEditor.AlignLeft />
                    <RichTextEditor.AlignCenter />
                    <RichTextEditor.AlignRight />
                  </RichTextEditor.ControlsGroup>
      
                  <RichTextEditor.ControlsGroup className="controls">
                    <RichTextEditor.Undo />
                    <RichTextEditor.Redo />
                  </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>
      
                <RichTextEditor.Content />
              </RichTextEditor>
      
              {/* Only show the save button when value has been changed and editor has been loaded */}
              { (editor && editor.getHTML() !== initialValue) &&
                <button 
                type="button" 
                className="button-orange"
                onClick={() => onValueSubmit(editor.getHTML())}>
                  Save
                </button>
              }
            </div>
          )
}