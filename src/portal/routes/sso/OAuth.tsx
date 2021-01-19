import { LoginForm } from '@portal/components/LoginView/LoginForm';
import { PortraitContainer } from '@portal/components/PortraitContainer';
import { checkTokenValid, getPortalJWTInfo } from '@portal/utils/auth';
import { TMemo } from '@shared/components/TMemo';
import Avatar from '@web/components/Avatar';
import { Alert, Button, Col, Divider, Row, Space, Typography } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import logoUrl from '@web/assets/img/logo@192.png';
import { CheckCircleFilled, UserOutlined } from '@ant-design/icons';
import qs from 'qs';
import { useLocation } from 'react-router';
import { useAsync } from 'react-use';
import { fetchOAuthAppInfo } from '@shared/model/oauth';
import Loading from '@portal/components/Loading';

const OAuthHasLoginRoot = styled.div`
  /* text-align: center; */
`;

const OAuthHasLoginConnection = styled(Row).attrs({
  align: 'middle',
  justify: 'space-between',
})`
  padding: 24px 0;
  width: 300px;
  margin: auto;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    width: 100%;
    border-top: ${(props) => props.theme.border.standard};
    border-top-width: 2px;
    border-top-style: dashed;
  }
`;

const ConnectionIcon = styled(Avatar).attrs({
  size: 96,
})``;

const OAuthHasLoginInfo = styled.div`
  border: ${(props) => props.theme.border.standard};
  border-radius: ${(props) => props.theme.radius.card};
  padding: 24px;

  > .ant-row {
    margin-bottom: 12px;
  }
`;

function useOAuthParams(): {
  appid: string;
  scope: string[];
  redirect: string;
} {
  const { search } = useLocation();
  const { appid, scope: scopeStr = '', redirect } = useMemo(() => {
    return qs.parse(search, { ignoreQueryPrefix: true });
  }, [search]);

  return {
    appid,
    scope: scopeStr.split(','),
    redirect,
  };
}

const OAuthHasLogin: React.FC = TMemo(() => {
  const jwtInfo = useMemo(() => getPortalJWTInfo(), []);
  const { appid, scope, redirect } = useOAuthParams();

  const { value: authorizeApp, loading, error } = useAsync(() => {
    return fetchOAuthAppInfo(appid);
  }, [appid]);

  const handleAuthorize = useCallback(() => {
    console.log('授权结果:', scope);
  }, [scope]);

  if (loading) {
    return <Loading />;
  }

  if (!authorizeApp || error) {
    return <Alert message="加载失败, 应用不存在" />;
  }

  return (
    <OAuthHasLoginRoot>
      <OAuthHasLoginConnection>
        <ConnectionIcon src={authorizeApp.icon} name={authorizeApp.name} />

        <CheckCircleFilled
          style={{ color: '#28a745', zIndex: 1, fontSize: 32 }}
        />

        <ConnectionIcon src={logoUrl} name="TRPG Engine" />
      </OAuthHasLoginConnection>

      <Typography.Title level={3} style={{ textAlign: 'center' }}>
        授权 {authorizeApp.name}
      </Typography.Title>

      <OAuthHasLoginInfo>
        <Row align="middle">
          <Space>
            <Col>
              <Avatar src={jwtInfo.avatar} name={jwtInfo.name} />
            </Col>
            <Col>
              <p>
                {authorizeApp.name} by{' '}
                <Typography.Link href={authorizeApp.website} target="_blank">
                  {authorizeApp.website}
                </Typography.Link>
              </p>
              <Typography.Text>
                想要访问你的 {jwtInfo.name} 账户
              </Typography.Text>
            </Col>
          </Space>
        </Row>

        {/* 访问内容 scope */}

        {scope.includes('public') && (
          <Row align="middle">
            <Space>
              <Avatar icon={<UserOutlined />} />
              <Typography.Text>公开的账户信息</Typography.Text>
            </Space>
          </Row>
        )}

        <Divider />

        <Row>
          <Button
            type="primary"
            block={true}
            size="large"
            onClick={handleAuthorize}
          >
            授权
          </Button>
        </Row>

        <Typography.Text>
          Authorizing will redirect to <a href={redirect}>{redirect}</a>
        </Typography.Text>
      </OAuthHasLoginInfo>
    </OAuthHasLoginRoot>
  );
});
OAuthHasLogin.displayName = 'OAuthHasLogin';

function useTokenValid() {
  const [isTokenValid, setIsTokenValid] = useState(false);

  const updateTokenValid = useCallback(async () => {
    const isValid = await checkTokenValid();
    setIsTokenValid(isValid);
  }, []);

  useEffect(() => {
    updateTokenValid();
  }, []);

  return {
    isTokenValid,
    updateTokenValid,
  };
}

const OAuthPage: React.FC = TMemo(() => {
  const { isTokenValid, updateTokenValid } = useTokenValid();

  const handleLoginSuccess = useCallback(() => {
    updateTokenValid();
  }, []);

  return (
    <PortraitContainer
      style={{
        margin: '80px auto auto',
      }}
    >
      {isTokenValid ? (
        <OAuthHasLogin />
      ) : (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      )}
    </PortraitContainer>
  );
});
OAuthPage.displayName = 'OAuthPage';

export default OAuthPage;
