package fr.inria.spirals.repairnator.process.step.checkoutrepository;

import fr.inria.spirals.repairnator.states.PipelineState;
import fr.inria.spirals.repairnator.process.inspectors.ProjectInspector;

/**
 * Created by fermadeiral.
 */
public class CheckoutBuggyBuildSourceCode extends CheckoutRepository {

    public CheckoutBuggyBuildSourceCode(ProjectInspector inspector) {
        super(inspector);
    }

    protected void businessExecute() {
        this.getLogger().debug("Checking out the source code of the previous build...");

        if (this.getInspector().getJobStatus().getRepairSourceDir() == null) {
            this.getLogger().error("Repair source dir is null: it is therefore impossible to continue.");
            this.shouldStop = true;
            this.setPipelineState(PipelineState.PREVIOUSBUILDCODENOTCHECKEDOUT);
            return;
        }

        super.setCheckoutType(CheckoutType.CHECKOUT_PATCHED_BUILD);

        super.businessExecute();

        super.setCheckoutType(CheckoutType.CHECKOUT_BUGGY_BUILD_SOURCE_CODE);

        super.businessExecute();

        if (this.shouldStop) {
            this.setPipelineState(PipelineState.PREVIOUSBUILDCODENOTCHECKEDOUT);
        } else {
            this.setPipelineState(PipelineState.PREVIOUSBUILDCODECHECKEDOUT);
            inspector.setCheckoutType(getCheckoutType());
        }
    }

}
