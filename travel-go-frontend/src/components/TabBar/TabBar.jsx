import './TabBar.css';

const TabBar = ({ tabs = [], activeTab, onTabChange }) => (
  <div className="tabbar">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={`tabbar__tab ${activeTab === tab.id ? 'tabbar__tab--active' : ''}`}
      >
        {tab.icon && (
          <span className="tabbar__icon">{tab.icon}</span>
        )}
        {tab.label}
      </button>
    ))}
  </div>
);

export default TabBar;