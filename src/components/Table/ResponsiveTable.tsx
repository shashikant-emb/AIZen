"use client"
import  React from "react"
import { useState,type ReactNode } from "react"
import "./ResponsiveTable.css"

export interface TableColumn<T> {
  header: string
  accessor: keyof T | ((item: T) => ReactNode)
  className?: string
  minWidth?: string
  maxWidth?: string
  hidden?: boolean
}

interface ResponsiveTableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  keyField: keyof T
  actions?: (item: T) => ReactNode
  expandableContent?: (item: T) => ReactNode
  emptyMessage?: string
  className?: string
}

export function ResponsiveTable<T>({
  data,
  columns,
  keyField,
  actions,
  expandableContent,
  emptyMessage = "No data available",
  className = "",
}: ResponsiveTableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const visibleColumns = columns.filter((col) => !col.hidden)

  if (data.length === 0) {
    return <div className="responsive-table-empty">{emptyMessage}</div>
  }

  return (
    <div className={`responsive-table-container ${className}`}>
      <table className="responsive-table">
        <thead>
          <tr>
            {visibleColumns.map((column, index) => (
              <th
                key={index}
                className={column.className || ""}
                style={{
                  minWidth: column.minWidth,
                  maxWidth: column.maxWidth,
                }}
              >
                {column.header}
              </th>
            ))}
            {actions && <th className="actions-column">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const rowId = String(item[keyField])
            const isExpanded = expandableContent && expandedRows[rowId]

            return (
              <>
                <tr key={rowId} className={isExpanded ? "expanded" : ""}>
                  {visibleColumns.map((column, index) => (
                    <td key={index} className={column.className || ""} data-label={column.header}>
                      {typeof column.accessor === "function"
                        ? column.accessor(item)
                        : (item[column.accessor] as ReactNode)}
                    </td>
                  ))}
                  {actions && <td className="actions-column">{actions(item)}</td>}
                </tr>
                {expandableContent && isExpanded && (
                  <tr className="expanded-content-row">
                    <td colSpan={visibleColumns.length + (actions ? 1 : 0)}>
                      <div className="expanded-content">{expandableContent(item)}</div>
                    </td>
                  </tr>
                )}
              </>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ResponsiveTable

