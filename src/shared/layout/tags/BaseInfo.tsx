import React from 'react';
import { ILayoutTypeAttributes, ILayoutType, LayoutTypeContext } from './Base';
import { Row, Col, Form, Input, Avatar } from 'antd';
import { getStateValue, setStateValue } from './utils';
import TextArea from 'antd/lib/input/TextArea';
import AvatarPicker from '@components/AvatarPicker';
import styled from 'styled-components';
const FormItem = Form.Item;

const BaseInfoContainer = styled(Row)`
  padding: 10px;
`;

interface Attr extends ILayoutTypeAttributes {}

/**
 * 基础信息
 * 所有模板必须的信息
 * 处理_name, _desc, _avatar这三个内置变量
 */
export default class BaseInfo implements ILayoutType<Attr> {
  name: string;

  getEditView(ctx: LayoutTypeContext<Attr>) {
    const { context } = ctx;

    return (
      <BaseInfoContainer>
        <Col sm={18}>
          <Form
            layout="horizontal"
            labelCol={{ xs: 6 }}
            wrapperCol={{ xs: 18 }}
          >
            <FormItem label="名称" required>
              <Input
                value={getStateValue(context, '_name')}
                onChange={(e) =>
                  setStateValue(context, '_name', e.target.value)
                }
              />
            </FormItem>
            <FormItem label="描述">
              <TextArea
                autosize={{ maxRows: 8, minRows: 4 }}
                value={getStateValue(context, '_desc')}
                onChange={(e) =>
                  setStateValue(context, '_desc', e.target.value)
                }
              />
            </FormItem>
          </Form>
        </Col>
        <Col sm={6} style={{ textAlign: 'center' }}>
          <AvatarPicker
            imageUrl={String(getStateValue(context, '_avatar'))}
            onChange={(imageUrl) => setStateValue(context, '_avatar', imageUrl)}
          />
        </Col>
      </BaseInfoContainer>
    );
  }

  getDetailView(ctx: LayoutTypeContext<Attr>) {
    const { context } = ctx;

    return (
      <BaseInfoContainer>
        <Col sm={18}>
          <Form
            layout="horizontal"
            labelCol={{ xs: 6 }}
            wrapperCol={{ xs: 18 }}
          >
            <FormItem label="名称" required>
              <div>{getStateValue(context, '_name')}</div>
            </FormItem>
            <FormItem label="描述">
              <div>{getStateValue(context, '_desc')}</div>
            </FormItem>
          </Form>
        </Col>
        <Col sm={6} style={{ textAlign: 'center' }}>
          <Avatar
            size={64}
            icon="user"
            src={String(getStateValue(context, '_avatar'))}
          />
        </Col>
      </BaseInfoContainer>
    );
  }
}
