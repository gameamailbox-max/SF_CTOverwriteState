/*:
 * @target MZ
 * @plugindesc ステート付与時に対象のTPBチャージタイムを指定値へ上書きします。
 * @author 巣ごもり梟
 *
 * @help
 * ============================================================================
 * SF_CTOverwriteState
 * Version: 1.0.1
 * ============================================================================
 *
 * ■概要
 *
 * ステートが新規付与または再付与されたとき、
 * そのステートのメモ欄に指定された数値へ対象のTPBチャージタイム（CT）を
 * 1回だけ上書きします。
 *
 * ■ステートのメモ欄
 *
 * <CTOverwrite:0.5>
 *
 * のように記述してください。
 * 数値は0.0～1.0で指定します。
 *
 * 0.0 = CT 0%
 * 0.5 = CT 50%
 * 1.0 = CT 100%
 *
 * ステートが付与された後は、このプラグインによるCTの固定は行いません。
 * 通常のTPB処理によってCTはその後進行します。
 *
 * メモ欄にCTOverwriteを記述していないステートには何もしません。
 *
 * ■注意
 *
 * 本プラグインはTPB戦闘時のみCTを変更します。
 *
 * ■変更履歴
 * Ver1.0.1：ステートの新規付与・再付与時のCT上書き処理を修正。
 *            付与が成立しないステートへの適用防止、指定値の検証を実施。
 * Ver1.0.0：初版。
 *
 * ============================================================================
 */

(() => {
    "use strict";

    const tagName = "CTOverwrite";

    //=========================================================================
    // Game_Battler
    // ステートの新規付与・再付与時にCTを1回だけ上書き
    //=========================================================================

    const _Game_Battler_addState =
        Game_Battler.prototype.addState;

    Game_Battler.prototype.addState =
        function(stateId) {

            _Game_Battler_addState.call(this, stateId);

            // 付与が成立しなかったステートには適用しない。
            if (!this.isStateAffected(stateId)) {
                return;
            }

            // TPB戦闘以外では何もしない
            if (
                !BattleManager.isTpb ||
                !BattleManager.isTpb()
            ) {
                return;
            }

            const state =
                $dataStates[stateId];

            if (!state || !state.meta) {
                return;
            }

            const rawValue =
                state.meta[tagName];

            if (
                rawValue === undefined ||
                String(rawValue).trim() === ""
            ) {
                return;
            }

            const value =
                Number(rawValue);

            if (!Number.isFinite(value)) {
                return;
            }

            const chargeTime =
                Math.max(
                    0,
                    Math.min(
                        1,
                        value
                    )
                );

            this._tpbChargeTime =
                chargeTime;
        };
})();
