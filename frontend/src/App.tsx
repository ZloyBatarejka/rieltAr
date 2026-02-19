import type { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, theme, Typography, Button, Space, App as AntApp } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import ruRU from 'antd/locale/ru_RU';
import { lightTheme, darkTheme } from './theme/themeConfig';
import { useThemeMode } from './theme/useThemeMode';

const { Title, Text } = Typography;

function App(): ReactElement {
  const { toggleMode, isDark } = useThemeMode();

  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        ...(isDark ? darkTheme : lightTheme),
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <AntApp>
        <BrowserRouter>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100vh',
              background: isDark ? '#141414' : '#f5f5f5',
              transition: 'background 0.3s',
            }}
          >
            <Space direction="vertical" align="center" size="large">
              <Title style={{ margin: 0 }}>🏠 RieltAr</Title>
              <Text type="secondary">Система управления арендой недвижимости</Text>
              <Button
                type="text"
                icon={isDark ? <BulbFilled /> : <BulbOutlined />}
                onClick={toggleMode}
                size="large"
              >
                {isDark ? 'Светлая тема' : 'Тёмная тема'}
              </Button>
            </Space>
          </div>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
