import { react as bindCallbacks } from 'auto-bind';
import * as isEqual from 'fast-deep-equal';
import * as React from 'react';
import { connect } from 'react-redux';
import { ConfigProviderContext } from '../../../config';
import { ChangeGroups } from '../../../flowTypes';
import { AppState, DispatchWithState } from '../../../store';
import GroupsElement from '../../form/GroupsElement';
import { mapGroupsToAssets, mapAssetsToGroups } from './helpers';
import ChangeGroupsFormProps from './props';
import { Types } from '../../../config/typeConfigs';
import { bindActionCreators } from 'redux';
import { dump } from '../../../utils';
import AssetService, { Asset } from '../../../services/AssetService';
import { fakePropType } from '../../../config/ConfigProvider';

export interface AddGroupsFormState {
    groups: Asset[];
}

export const LABEL = ' Select the group(s) to add the contact to.';
export const PLACEHOLDER = 'Enter the name of an existing group or create a new one';

export const labelSpecId = 'label';

export class AddGroupsForm extends React.PureComponent<ChangeGroupsFormProps, AddGroupsFormState> {
    public static contextTypes = {
        endpoints: fakePropType,
        assetService: fakePropType
    };

    constructor(props: ChangeGroupsFormProps, context: ConfigProviderContext) {
        super(props);

        const groups: Asset[] = this.getGroups();

        this.state = {
            groups
        };

        bindCallbacks(this, {
            include: [/^on/]
        });
    }

    public onGroupsChanged(groups: Asset[]): void {
        if (!isEqual(groups, this.state.groups)) {
            this.setState({
                groups
            });
        }
    }

    public onValid(): void {
        const newAction: ChangeGroups = {
            uuid: this.props.action.uuid,
            type: this.props.typeConfig.type,
            groups: mapAssetsToGroups(this.state.groups)
        };

        this.props.updateAction(newAction);
    }

    private getGroups(): Asset[] {
        if (this.props.action.groups === null) {
            return [];
        }

        if (
            this.props.action.groups.length &&
            this.props.action.type !== Types.remove_contact_groups
        ) {
            return mapGroupsToAssets(this.props.action.groups);
        }

        return [];
    }

    public render(): JSX.Element {
        return (
            <>
                <p data-spec={labelSpecId}>{LABEL}</p>
                <GroupsElement
                    ref={this.props.onBindWidget}
                    name="Groups"
                    placeholder={PLACEHOLDER}
                    assets={this.context.assetService.getGroupAssets()}
                    groups={this.state.groups}
                    add={true}
                    required={true}
                    onChange={this.onGroupsChanged}
                />
            </>
        );
    }
}

/* istanbul ignore next */
const mapStateToProps = ({ nodeEditor: { typeConfig } }: AppState) => ({
    typeConfig
});

const ConnectedAddGroupForm = connect(mapStateToProps, null, null, { withRef: true })(
    AddGroupsForm
);

export default ConnectedAddGroupForm;
