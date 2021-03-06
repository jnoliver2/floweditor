import * as React from 'react';
import { Endpoints, FlowEditorConfig, Languages } from '../flowTypes';
import AssetService, { Assets } from '../services/AssetService';

export const fakePropType: any = (): any => null;
fakePropType.isRequired = (): any => null;

interface ConfigProviderProps {
    config: FlowEditorConfig;
    children: any;
}

export interface ConfigProviderContext {
    assetService: AssetService;
    endpoints: Endpoints;
    languages: Languages;
    flow: string;
}

// ----------------------------------------------------------------------------------------------

export const SINGLE_CHILD_ERROR = 'ConfigProvider expects only one child component.';
export const VALID_CHILD_ERROR =
    'ConfigProvider expects a valid React element: https://reactjs.org/docs/react-api.html#isvalidelement';

export default class ConfigProvider extends React.Component<ConfigProviderProps> {
    public static childContextTypes = {
        assetService: fakePropType,
        endpoints: fakePropType,
        languages: fakePropType,
        flow: fakePropType
    };

    constructor(props: ConfigProviderProps) {
        super(props);

        if (React.Children.count(props.children) > 1) {
            throw new Error(SINGLE_CHILD_ERROR);
        } else if (!React.isValidElement(props.children)) {
            throw new Error(VALID_CHILD_ERROR);
        }
    }

    public getChildContext(): ConfigProviderContext {
        return {
            assetService: this.props.config.assetService,
            languages: this.props.config.languages,
            endpoints: this.props.config.endpoints,
            flow: this.props.config.flow
        };
    }

    public render(): JSX.Element {
        return React.Children.only(this.props.children);
    }
}
