import React from 'react';
import { regCup } from '@saucerjs/core';
import { Space } from 'antd';
import { CommonEditorSettings, InputEditorSettings } from '../shared';
import { TagInputEdit } from '@shared/components/layout/tags/Input/edit';

regCup({
  name: 'Input',
  displayName: '输入框',
  desc: '标准输入框',
  type: 'leaf',
  defaultAttrs: ({ nodeId }) => ({
    name: nodeId,
  }),
  render({ nodeId, attrs }) {
    return (
      <TagInputEdit
        key={nodeId}
        {...attrs}
        _name={'Input'}
        _childrenEl={[]}
        name={attrs['name'] || nodeId}
      />
    );
  },
  editor() {
    return (
      <Space direction="vertical">
        <CommonEditorSettings />

        <InputEditorSettings />
      </Space>
    );
  },
});
