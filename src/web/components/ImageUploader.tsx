import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { showAlert } from '../../redux/actions/ui';
import _get from 'lodash/get';

import './ImageUploader.scss';
import AvatarPicker from './AvatarPicker';
import { blobUrlToFile } from '@web/utils/file-helper';
import { toAvatar } from '@shared/utils/upload-helper';

type CSSUnit = number | string;

interface Props extends DispatchProp {
  type: 'actor' | 'user' | 'group';
  attachUUID: string;
  width?: CSSUnit;
  height?: CSSUnit;
  containerWidth?: CSSUnit;
  containerHeight?: CSSUnit;
  onUploadSuccess?: (imageInfo: any) => void;

  user_uuid: string; // 绑定的用户UUID
}

/**
 * 用于当前用户相关图片上传
 */
class ImageUploader extends React.Component<Props> {
  state = {
    isUploading: false,
    uploadProgress: 0,
  };

  /**
   * 选择图片后回调
   */
  handlePickImage = async (blobUrl: string) => {
    const file = await blobUrlToFile(blobUrl);

    const headers = {
      'avatar-type': this.props.type || 'actor',
    };
    if (this.props.attachUUID) {
      headers['attach-uuid'] = this.props.attachUUID;
    }
    this.setState({ isUploading: true });

    toAvatar(this.props.user_uuid, file, {
      uploadField: 'avatar',
      headers,
      onProgress: (percent) => {
        const uploadProgress = (percent * 100).toFixed();
        console.log(`进度:${uploadProgress}`);
        this.setState({ uploadProgress });
      },
    })
      .then((json) => {
        this.setState({
          isUploading: false,
          uploadProgress: 0,
        });
        if (typeof json === 'object') {
          console.log('上传成功', json);
          if (this.props.onUploadSuccess) {
            this.props.onUploadSuccess(json);
          }
        } else {
          this.props.dispatch(showAlert('图片上传失败:' + json));
          console.error(json);
        }
      })
      .catch((e) => {
        this.setState({
          isUploading: false,
          uploadProgress: 0,
        });
        const errorMsg = _get(e, 'response.data.msg', e.toString());
        this.props.dispatch(showAlert('图片上传失败:' + errorMsg));
        console.error(e);
      });
  };

  render() {
    return (
      <AvatarPicker
        className="image-uploader"
        disabled={this.state.isUploading}
        onChange={this.handlePickImage}
      >
        <div className={'mask' + (this.state.isUploading ? ' active' : '')}>
          {this.state.isUploading
            ? this.state.uploadProgress
              ? `${this.state.uploadProgress}%`
              : '图片上传中...'
            : '点击上传图片'}
        </div>
        {this.props.children}
      </AvatarPicker>
    );
  }
}

export default connect((state: any) => ({
  user_uuid: state.getIn(['user', 'info', 'uuid']),
}))(ImageUploader);
