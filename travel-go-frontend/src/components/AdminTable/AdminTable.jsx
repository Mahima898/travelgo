import { EmptyState } from '../Feedback/Feedback';
import Button from '../Button/Button';
import './AdminTable.css';

export const AdminHeader = ({
  title,
  subtitle,
  count,
  onAdd,
  addLabel = '+ Add New',
}) => (
  <div className="admin-header">
    <div className="admin-header__text">
      <h1 className="admin-header__title">
        {title}
        {count !== undefined && (
          <span className="admin-header__count">({count})</span>
        )}
      </h1>
      {subtitle && (
        <p className="admin-header__subtitle">{subtitle}</p>
      )}
    </div>
    {onAdd && (
      <Button variant="accent" onClick={onAdd}>
        {addLabel}
      </Button>
    )}
  </div>
);


export const AdminSearch = ({ value, onChange, placeholder = 'Search...' }) => (
  <div className="admin-search">
    <span className="admin-search__icon">🔍</span>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="admin-search__input"
    />
    {value && (
      <button
        className="admin-search__clear"
        onClick={() => onChange('')}
      >
        ×
      </button>
    )}
  </div>
);


export const AdminTable = ({
  columns,
  rows,
  onEdit,
  onDelete,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="admin-table-loader">
        <div className="admin-table-loader__spinner" />
        <p>Loading data...</p>
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="No records found"
        subtitle="Create your first record using the button above."
      />
    );
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr className="admin-table__head-row">
            {columns.map((col) => (
              <th key={col.key} className="admin-table__th">
                {col.label}
              </th>
            ))}
            <th className="admin-table__th admin-table__th--actions">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id || i} className="admin-table__row">
              {columns.map((col) => (
                <td key={col.key} className="admin-table__td">
                  {col.render
                    ? col.render(row[col.key], row)
                    : (row[col.key] ?? '—')}
                </td>
              ))}
              <td className="admin-table__td admin-table__td--actions">
                <div className="admin-table__actions">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onEdit(row)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDelete(row)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;