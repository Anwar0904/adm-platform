"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCreateLead = useCreateLead;
var react_query_1 = require("@tanstack/react-query");
var lead_client_1 = require("@/services/lead.client");
function useCreateLead() {
    return (0, react_query_1.useMutation)({
        mutationFn: function (payload) { return (0, lead_client_1.createLead)(payload); },
    });
}
