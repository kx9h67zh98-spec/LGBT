(function () {
    "use strict";

    document.addEventListener(
        "DOMContentLoaded",
        function () {
            injectPanel();
            bindRefresh();
            loadClinicalGuidance();
        }
    );

    function injectPanel() {
        const healthTab =
            document.getElementById(
                "healthTab"
            );

        if (
            !healthTab
            ||
            document.getElementById(
                "clinicalGuidancePanel"
            )
        ) {
            return;
        }

        healthTab.insertAdjacentHTML(
            "beforeend",
            `
            <section class="container mt-4 mb-4" id="clinicalGuidancePanel">
                <div class="card border-success-subtle shadow-sm">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                            <div>
                                <p class="text-success fw-bold mb-1">EVIDENCE-INFORMED GUIDANCE</p>
                                <h2 class="h4 fw-bold mb-2">Clinical Wellness Recommendations</h2>
                                <p class="text-body-secondary mb-0">
                                    General screening and wellness guidance based on your saved Health Profile.
                                </p>
                            </div>

                            <button
                                type="button"
                                class="btn btn-outline-success btn-sm"
                                id="refreshClinicalGuidance"
                            >
                                <i class="bi bi-arrow-clockwise me-1"></i>
                                Refresh
                            </button>
                        </div>

                        <div
                            id="clinicalGuidanceDisclaimer"
                            class="alert alert-warning mt-3 mb-3"
                        >
                            This feature does not diagnose disease or replace professional medical care.
                        </div>

                        <div id="clinicalGuidanceContent">
                            <div class="text-body-secondary">
                                Loading guidance...
                            </div>
                        </div>

                        <div
                            id="clinicalGuidanceSources"
                            class="small text-body-secondary mt-3"
                        ></div>
                    </div>
                </div>
            </section>
            `
        );
    }

    function bindRefresh() {
        const refreshButton =
            document.getElementById(
                "refreshClinicalGuidance"
            );

        if (refreshButton) {
            refreshButton.addEventListener(
                "click",
                loadClinicalGuidance
            );
        }

        const healthForm =
            document.getElementById(
                "healthForm"
            );

        if (healthForm) {
            healthForm.addEventListener(
                "submit",
                function () {
                    window.setTimeout(
                        loadClinicalGuidance,
                        900
                    );
                }
            );
        }
    }

    async function loadClinicalGuidance() {
        const content =
            document.getElementById(
                "clinicalGuidanceContent"
            );

        const disclaimer =
            document.getElementById(
                "clinicalGuidanceDisclaimer"
            );

        const sources =
            document.getElementById(
                "clinicalGuidanceSources"
            );

        if (!content) {
            return;
        }

        content.innerHTML =
            '<div class="text-body-secondary">Loading guidance...</div>';

        try {
            const response =
                await fetch(
                    "api/clinical-recommendations",
                    {
                        credentials:
                            "same-origin",
                        cache:
                            "no-store"
                    }
                );

            const data =
                await response.json();

            if (
                !response.ok
                ||
                !data.success
            ) {
                throw new Error(
                    data.message
                    ||
                    "Unable to load guidance."
                );
            }

            if (disclaimer) {
                disclaimer.textContent =
                    data.disclaimer
                    ||
                    "This feature provides general wellness guidance only.";
            }

            renderRecommendations(
                content,
                data.recommendations
                ||
                []
            );

            renderSources(
                sources,
                data.sources
                ||
                []
            );

        } catch (error) {
            content.innerHTML =
                `
                <div class="alert alert-danger mb-0">
                    ${escapeHtml(
                        error.message
                        ||
                        "Unable to load guidance."
                    )}
                </div>
                `;
        }
    }

    function renderRecommendations(
        container,
        recommendations
    ) {
        if (!recommendations.length) {
            container.innerHTML =
                '<div class="text-body-secondary">No recommendations available.</div>';

            return;
        }

        container.innerHTML =
            recommendations.map(
                function (item) {
                    const type =
                        bootstrapType(
                            item.level
                        );

                    return `
                        <div class="alert alert-${type} mb-2">
                            <div class="fw-bold mb-1">
                                ${escapeHtml(item.title)}
                            </div>
                            <div>
                                ${escapeHtml(item.message)}
                            </div>
                        </div>
                    `;
                }
            ).join("");
    }

    function renderSources(
        container,
        sources
    ) {
        if (!container) {
            return;
        }

        if (!sources.length) {
            container.innerHTML =
                "";

            return;
        }

        container.innerHTML =
            "<strong>References:</strong> "
            +
            sources.map(
                function (source) {
                    return `
                        <a
                            href="${escapeAttribute(source.url)}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-success"
                        >
                            ${escapeHtml(source.label)}
                        </a>
                    `;
                }
            ).join(" · ");
    }

    function bootstrapType(
        level
    ) {
        const allowed =
            [
                "success",
                "info",
                "warning",
                "danger"
            ];

        return allowed.includes(
            level
        )
            ?
            level
            :
            "info";
    }

    function escapeHtml(
        value
    ) {
        return String(
            value
            ??
            ""
        )
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function escapeAttribute(
        value
    ) {
        return escapeHtml(
            value
        );
    }
})();
