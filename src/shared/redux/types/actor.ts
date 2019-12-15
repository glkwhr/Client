import { Record, List } from 'immutable';

export interface ActorType {
  id: number;
  uuid: string;
  name: string;
  desc: string;
  avatar: string;
  info: ActorDataType;
  template_uuid: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  ownerId: number;
}

export interface ActorDataType {
  [key: string]: string;
}

export interface ActorTemplateType {
  uuid: string;
  name: string;
  desc: string;
  avatar: string | null;
  info: any;
  layout: string;
  built_in: boolean;
  is_public: boolean;

  updatedAt: string;
}

export type ActorTemplateStateType = Record<ActorTemplateType>;

export type ActorState = Record<{
  isFindingTemplate: boolean;
  suggestTemplate: List<ActorTemplateStateType>;
  findingResult: List<any>;
  currentEditedTemplate: Record<{
    uuid: string;
    name: string;
    desc: string;
    avatar: string;
    info: string;
  }>;
  selfTemplate: List<any>;
  selectedTemplate: any;
  selfActors: List<any>;
  selectedActorUUID: string;
}>;
