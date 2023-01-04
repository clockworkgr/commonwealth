/* eslint-disable no-use-before-define */
/* @jsx m */

import m from 'mithril';
import $ from 'jquery';
import ClassComponent from 'class_component';

import 'components/rules/rule_modal.scss';

import app from 'state';
import { RuleMetadata } from 'server/util/rules/ruleTypes';
import { CWCard } from '../component_kit/cw_card';
import { CWDropdown, DropdownItemType } from '../component_kit/cw_dropdown';
import { CWTextInput } from '../component_kit/cw_text_input';
import { CWRuleTable } from './rule_table';
import { CWButton } from '../component_kit/cw_button';
import { CWText } from '../component_kit/cw_text';
import { CWIcon } from '../component_kit/cw_icons/cw_icon';

type RuleEditSectionAttrs = {
  internalBuiltRule: Record<string, unknown>;
  ruleArgument: {
    name: string;
    description: string;
    type: string;
  };
  ruleTypeIdentifier: string;
  argumentIdx: number;
  isNested: boolean;
};

// Handles the details of displaying a rule
class RuleEditSection extends ClassComponent<RuleEditSectionAttrs> {
  private subRuleResolved: boolean;
  private subRules: Array<RuleMetadata | any>;
  private subRuleEditState: Array<boolean>;

  oninit(vnode) {
    const { internalBuiltRule, ruleTypeIdentifier, ruleArgument } = vnode.attrs;
    this.subRuleResolved = true;
    if (ruleArgument.type === 'rule[]') {
      this.subRules = internalBuiltRule[ruleTypeIdentifier][0]; // Only applicable for compound rules
      this.subRuleEditState = this.subRules.map(() => false);
    }
  }

  onupdate(vnode) {
    const { internalBuiltRule, ruleTypeIdentifier, ruleArgument } = vnode.attrs;

    if (ruleArgument.type === 'rule[]') {
      this.subRules = internalBuiltRule[ruleTypeIdentifier][0];
    }
  }

  view(vnode) {
    const {
      internalBuiltRule,
      ruleArgument,
      ruleTypeIdentifier,
      argumentIdx,
      isNested,
    } = vnode.attrs;

    if (ruleArgument.type === 'address' || ruleArgument.type === 'balance') {
      return (
        <div class="display-section">
          <CWTextInput
            label={ruleArgument.name}
            placeholder={ruleArgument.description}
            oninput={(e) => {
              internalBuiltRule[ruleTypeIdentifier][argumentIdx] =
                e.target.value;
            }}
            value={
              internalBuiltRule[ruleTypeIdentifier][argumentIdx] !== ''
                ? internalBuiltRule[ruleTypeIdentifier][argumentIdx]
                : undefined
            }
          />
        </div>
      );
    } else if (
      ruleArgument.type === 'address[]' ||
      ruleArgument.type === 'balance[]'
    ) {
      return (
        <div class="display-section">
          <CWTextInput
            label={`Add ${ruleArgument.description}`}
            placeholder={ruleArgument.description}
            onenterkey={(e) => {
              internalBuiltRule[ruleTypeIdentifier][argumentIdx].unshift(
                e.target.value
              );
            }}
            clearOnEnter
          />
          <CWRuleTable
            title={ruleArgument.description}
            data={internalBuiltRule[ruleTypeIdentifier][argumentIdx]}
            onDelete={(idx) => {
              internalBuiltRule[ruleTypeIdentifier][argumentIdx].splice(idx, 1);
              m.redraw();
            }}
          />
        </div>
      );
    } else if (ruleArgument.type === 'rule[]') {
      return (
        <div class={`display-section${isNested ? '' : ' parent'}`}>
          {internalBuiltRule[ruleTypeIdentifier][0].map((subRule, idx) => {
            if (this.subRuleEditState[idx]) {
              return (
                <RuleModal
                  isNested
                  onFinish={(rule) => {
                    internalBuiltRule[ruleTypeIdentifier][0][idx] = rule;
                    this.subRuleEditState[idx] = false;
                  }}
                  rule={subRule}
                  onCancel={(internalRule, ruleValid) => {
                    if (Object.keys(internalRule).length > 0 && ruleValid) {
                      this.subRuleEditState[idx] = false;
                    } else {
                      this.subRules = this.subRules.filter((val, i) => {
                        return i !== idx;
                      });
                      this.subRuleEditState = this.subRuleEditState.filter(
                        (val, i) => {
                          return i !== idx;
                        }
                      );
                      internalBuiltRule[ruleTypeIdentifier][0] = this.subRules;
                      m.redraw();
                    }
                  }}
                />
              );
            } else {
              return (
                <div class="completed-rule-display">
                  <CWText type="h5">{Object.keys(subRule)[0]}</CWText>
                  <div class="icons-display">
                    <CWIcon
                      iconName="write"
                      onclick={() => {
                        this.subRuleEditState[idx] = true;
                        m.redraw();
                      }}
                    />
                    <CWIcon
                      iconName="trash"
                      onclick={() => {
                        this.subRules = this.subRules.filter((val, i) => {
                          return i !== idx;
                        });
                        this.subRuleEditState = this.subRuleEditState.filter(
                          (val, i) => {
                            return i !== idx;
                          }
                        );
                        internalBuiltRule[ruleTypeIdentifier][0] =
                          this.subRules;
                        m.redraw();
                      }}
                    />
                  </div>
                </div>
              );
            }
          })}
          <div className="add-button-wrapper">
            <CWButton
              onclick={() => {
                this.subRules.push({});
                this.subRuleEditState.push(true);
                internalBuiltRule[ruleTypeIdentifier][0] = this.subRules;
                m.redraw();
              }}
              label="add subrule"
              iconName="plus"
              buttonType="mini-black"
            />
          </div>
        </div>
      );
    }
    return <div></div>;
  }
}

type RuleModalAttrs = {
  onFinish: (rule: Record<string, unknown>) => void;
  isNested?: boolean;
  rule?: Record<string, unknown>;
  className?: string;
  onCancel?: (
    internalRule: Record<string, unknown>,
    ruleValid: boolean
  ) => void;
};

class RuleModal extends ClassComponent<RuleModalAttrs> {
  private editingRule: boolean;
  private showSelectRule: boolean;
  private showRuleOptions: boolean;
  private internalBuiltRule: Record<string, unknown>;
  private ruleMetadata: RuleMetadata;
  private readyForReview: boolean;
  private readyForSubmit: boolean;
  private ruleInitiallyValid: boolean;

  oninit(vnode) {
    this.editingRule =
      vnode.attrs.rule !== undefined &&
      Object.keys(vnode.attrs.rule).length > 0;
    if (this.editingRule) {
      this.internalBuiltRule = vnode.attrs.rule;
      this.showSelectRule = false;
      this.showRuleOptions = true;
      this.ruleMetadata = app.rules.ruleTypes[Object.keys(vnode.attrs.rule)[0]];
      this.ruleInitiallyValid = true;
    } else {
      this.internalBuiltRule = {};
      this.showSelectRule = true;
      this.ruleInitiallyValid = false;
    }
    this.readyForReview = false;
    this.readyForSubmit = false;
  }

  view(vnode) {
    const { onFinish, isNested, onCancel } = vnode.attrs;

    const ruleOptions = Object.keys(app.rules.ruleTypes).map((ruleType) => {
      return { label: ruleType, value: ruleType };
    });

    return (
      <CWCard
        elevation="elevation-3"
        className={`RuleModal${isNested ? ` child-modal` : ''}`}
      >
        <div className="top-section">
          <div class="title-section">
            <CWText type="h3" style="semiBold">
              {this.ruleMetadata && !this.readyForReview
                ? this.ruleMetadata.name
                : this.readyForReview
                ? 'Review Your Rule'
                : `Select ${isNested ? 'Subr' : 'R'}ule Type`}
            </CWText>
            <CWText type="b1">
              {this.ruleMetadata ? this.ruleMetadata.description : ''}
            </CWText>
          </div>
          {this.showSelectRule && (
            <CWDropdown
              options={ruleOptions}
              onSelect={(item: DropdownItemType) => {
                // Clear out the internal built rule in event of switch
                this.internalBuiltRule = {};
                this.ruleMetadata = app.rules.ruleTypes[item.label];
                this.readyForReview = false;
                this.readyForSubmit = false;

                // Create correct structure for rule
                const ruleValue = [];
                for (const argument of this.ruleMetadata.arguments) {
                  if (
                    argument.type === 'address[]' ||
                    argument.type === 'balance[]'
                  ) {
                    ruleValue.push([]);
                  } else if (
                    argument.type === 'address' ||
                    argument.type === 'balance'
                  ) {
                    ruleValue.push([]);
                  } else if (argument.type === 'rule[]') {
                    ruleValue.push([]);
                  }
                }
                this.internalBuiltRule[item.label] = ruleValue;

                this.showRuleOptions = true;
                m.redraw();
              }}
              initialValue={{
                label: 'Select Rule Type',
                value: 'Select Rule Type',
              }}
              label=""
            />
          )}
          {this.showRuleOptions &&
            this.ruleMetadata.arguments.map((argument, idx) => {
              return (
                <RuleEditSection
                  ruleArgument={argument}
                  argumentIdx={idx}
                  internalBuiltRule={this.internalBuiltRule}
                  ruleTypeIdentifier={Object.keys(this.internalBuiltRule)[0]}
                  isNested={isNested}
                />
              );
            })}
        </div>

        <div class="footer-section">
          <CWButton
            label="Cancel"
            buttonType="secondary-black"
            onclick={() => {
              if (isNested && onCancel) {
                onCancel(this.internalBuiltRule, this.ruleInitiallyValid);
              } else {
                $('.RuleModal').trigger('modalexit');
              }
            }}
            className="cancel-button"
          />
          {this.readyForSubmit ? (
            <CWButton
              label="Finish"
              onclick={() => {
                onFinish(this.internalBuiltRule);
                if (!isNested) {
                  $('.RuleModal').trigger('modalexit');
                }
              }}
            />
          ) : (
            <CWButton
              label="Next"
              buttonType="primary-black"
              onclick={() => {
                if (Object.keys(this.internalBuiltRule).length > 0) {
                  this.readyForReview = true;
                  this.readyForSubmit = true;
                  m.redraw();
                }
              }}
            />
          )}
        </div>
      </CWCard>
    );
  }
}

export default RuleModal;
