import { FileNodeConfigs } from './configs/FileNodeConfigs';
import { BasicNodeConfigs } from './configs/BasicNodeConfigs';
import { FileNodeTypes } from './nodeTypes/FileNodeTypes';
import { BasicNodeTypes } from './nodeTypes/BasicNodeTypes';
import { ControlNodeTypes } from './nodeTypes/ControlNodeTypes';
import { ControlNodeConfigs } from './configs/ControlNodeConfigs';

export const nodeTypes = {
  ...FileNodeTypes,
  ...BasicNodeTypes,
  ...ControlNodeTypes,
};

export const nodeConfigs = {
  ...FileNodeConfigs,
  ...BasicNodeConfigs,
  ...ControlNodeConfigs,
}
