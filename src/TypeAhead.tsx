import React from "react"
import { TypeaheadProps } from "./App"

export const TypeAhead = React.memo(
  ({
    value = "",
    suggestions,
    onInputChange,
    onSelection,
    onPaginate,
    showPagination = false,
    className,
    placeholder,
    paginationText,
  }: TypeaheadProps) => (
    <div className="flex flex-col relative typeahead-container">
      <div className="typeahead-container">
        <input
          className={className}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onInputChange(e.target.value)}
        />
        <div className="loader"></div>
      </div>
      {!!suggestions?.length && (
        <ul
          role="listbox"
          className={`text-left absolute top-full bg-white w-full ${
            suggestions.length > 0 ? "border-2 border-slate-200" : ""
          }`}
        >
          {suggestions.map((suggestion) => (
            <li
              className="p-1 hover:bg-slate-200 cursor-pointer"
              key={suggestion}
              role="option"
              onClick={() => {
                onSelection(suggestion)
                onInputChange(null)
              }}
            >
              {suggestion}
            </li>
          ))}
          {suggestions.length > 0 && showPagination && (
            <li
              className="p-1 bg-slate-100 hover:bg-slate-200 cursor-pointer text-center"
              onClick={onPaginate}
            >
              {paginationText}
            </li>
          )}
        </ul>
      )}
    </div>
  ),
)
