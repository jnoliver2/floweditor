import { react as bindCallbacks } from 'auto-bind';
import * as classNames from 'classnames/bind';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getTypeConfig } from '../../../config';
import { ConfigProviderContext } from '../../../config';
import { Types } from '../../../config/typeConfigs';
import { AnyAction, FlowNode, LocalizationMap } from '../../../flowTypes';
import {
    ActionAC,
    AppState,
    DispatchWithState,
    moveActionUp,
    OnOpenNodeEditor,
    onOpenNodeEditor,
    removeAction
} from '../../../store';
import { createClickHandler, getLocalization } from '../../../utils';
import { Language } from '../../LanguageSelector';
import * as shared from '../../shared.scss';
import TitleBar from '../../TitleBar';
import * as styles from './Action.scss';
import { fakePropType } from '../../../config/ConfigProvider';

export interface ActionWrapperPassedProps {
    thisNodeDragging: boolean;
    first: boolean;
    action: AnyAction;
    localization: LocalizationMap;
    render: (action: AnyAction) => React.ReactNode;
}

export interface ActionWrapperStoreProps {
    node: FlowNode;
    language: Language;
    translating: boolean;
    onOpenNodeEditor: OnOpenNodeEditor;
    removeAction: ActionAC;
    moveActionUp: ActionAC;
}

export type ActionWrapperProps = ActionWrapperPassedProps & ActionWrapperStoreProps;

export const actionContainerSpecId = 'action-container';
export const actionOverlaySpecId = 'action-overlay';
export const actionInteractiveDivSpecId = 'interactive-div';
export const actionBodySpecId = 'action-body';

const cx = classNames.bind({ ...shared, ...styles });

// Note: this needs to be a ComponentClass in order to work w/ react-flip-move
export class ActionWrapper extends React.Component<ActionWrapperProps> {
    public static contextTypes = {
        languages: fakePropType
    };

    constructor(props: ActionWrapperProps, context: ConfigProviderContext) {
        super(props);

        bindCallbacks(this, {
            include: [/^on/]
        });
    }

    public onClick(event: React.MouseEvent<HTMLDivElement>): void {
        if (!this.props.thisNodeDragging) {
            event.preventDefault();
            event.stopPropagation();
            this.props.onOpenNodeEditor(this.props.node, this.props.action, this.context.languages);
        }
    }

    private onRemoval(evt: React.MouseEvent<HTMLDivElement>): void {
        evt.stopPropagation();

        this.props.removeAction(this.props.node.uuid, this.props.action);
    }

    private onMoveUp(evt: React.MouseEvent<HTMLDivElement>): void {
        evt.stopPropagation();

        this.props.moveActionUp(this.props.node.uuid, this.props.action);
    }

    public getAction(): AnyAction {
        const localization = getLocalization(
            this.props.action,
            this.props.localization,
            this.props.language.iso,
            this.context.languages
        );

        return localization && this.props.translating
            ? (localization.getObject() as AnyAction)
            : this.props.action;
    }

    private getClasses(): string {
        const localizedKeys = [];
        let missingLocalization = false;

        if (this.props.translating) {
            if (this.props.action.type === Types.send_msg) {
                localizedKeys.push('text');
            }

            if (localizedKeys.length !== 0) {
                const localization = getLocalization(
                    this.props.action,
                    this.props.localization,
                    this.props.language.iso,
                    this.context.languages
                );

                if (localization.isLocalized()) {
                    for (const key of localizedKeys) {
                        if (!(key in localization.localizedKeys)) {
                            missingLocalization = true;
                            break;
                        }
                    }
                } else {
                    missingLocalization = true;
                }
            }
        }

        return cx({
            [styles.action]: true,
            [styles.has_router]:
                this.props.node.hasOwnProperty('router') && this.props.node.router !== null,
            [styles.translating]: this.props.translating,
            [styles.not_localizable]: this.props.translating && localizedKeys.length === 0,
            [styles.missing_localization]: missingLocalization
        });
    }

    public render(): JSX.Element {
        const { name } = getTypeConfig(this.props.action.type);
        const classes = this.getClasses();
        const actionToInject = this.getAction();

        const titleBarClass = shared[this.props.action.type] || shared.missing;
        const actionClass = styles[this.props.action.type] || styles.missing;
        const showRemoval = !this.props.translating;
        const showMove = !this.props.first && !this.props.translating;

        return (
            <div
                id={`action-${this.props.action.uuid}`}
                className={classes}
                data-spec={actionContainerSpecId}
            >
                <div className={styles.overlay} data-spec={actionOverlaySpecId} />
                <div {...createClickHandler(this.onClick)} data-spec={actionInteractiveDivSpecId}>
                    <TitleBar
                        __className={titleBarClass}
                        title={name}
                        onRemoval={this.onRemoval}
                        showRemoval={showRemoval}
                        showMove={showMove}
                        onMoveUp={this.onMoveUp}
                    />
                    <div className={styles.body + ' ' + actionClass} data-spec={actionBodySpecId}>
                        {this.props.render(actionToInject)}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({
    flowContext: { definition: { localization } },
    flowEditor: { editorUI: { language, translating } }
}: AppState) => ({
    language,
    translating,
    localization
});

const mapDispatchToProps = (dispatch: DispatchWithState) =>
    bindActionCreators(
        {
            onOpenNodeEditor,
            removeAction,
            moveActionUp
        },
        dispatch
    );

const ConnectedActionWrapper = connect(mapStateToProps, mapDispatchToProps)(ActionWrapper);

export default ConnectedActionWrapper;
