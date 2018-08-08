import React from 'react'

import type { SearchInputProps } from './Definition.js';

const SearchInput = ({ containerClass, labelClass, inputClass, keyWord, clearWord, isFocus, placeholderText, onChange = () => {} }: SearchInputProps) => {
    let isOnComposition: boolean = false
    let searchKeyWord: string = null
    const isChrome = !!window.chrome && !!window.chrome.webstore

    const handleComposition = (e: KeyboardEvent) => {
        if (e.type === 'compositionend') {
            //composition結束，代表中文輸入完成
            isOnComposition = false
            if (e.target instanceof HTMLInputElement && !isOnComposition && isChrome) {
                //進行搜尋
                onChange(searchKeyWord.value);
            }

        } else {
            //composition進行中，代表正在輸入中文
            isOnComposition = true
        }

    }
    return (
        <div className={containerClass}>
            <label className={labelClass}>目的地</label>
            <input
                type="text"
                ref={el => { searchKeyWord = el }}
                className={inputClass}
                placeholder={placeholderText}
                onCompositionStart={handleComposition}
                onCompositionUpdate={handleComposition}
                onCompositionEnd={handleComposition}
                onChange={(e: KeyboardEvent) => {
                    //只有onComposition===false，才作onChange
                    if (e.target instanceof HTMLInputElement && !isOnComposition) {
                        onChange(searchKeyWord.value);
                    }
                    clearWord(searchKeyWord.value)
                }}
                value={keyWord || ''}
                onFocus={() => isFocus && isFocus(true)}
                onBlur={() => isFocus && isFocus(false)}
            />
        </div>
    )
}
export default SearchInput
