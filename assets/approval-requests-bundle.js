import{r as e,M as t,u as s,f as n,j as a,a as r,t as o,d as l,O as i,c as u,v as c,E as p,h as d,w as m,x as h,A as j,y as v,X as f,z as b,B as q,G as x,H as g,J as w,K as y,L as k,g as _,N as $,Q as C,R,U as A,V as S,W as I,Y as L,Z as U,_ as T,k as z,$ as E,a0 as D,a1 as N,F as P,a2 as B,T as F,n as O,a3 as K,a4 as V,a5 as M,a6 as H,a7 as W,a8 as J,a9 as G,aa as X,ab as Y,ac as Z,ad as Q,ae as ee,af as te,ag as se,ah as ne,ai as ae,aj as re,ak as oe}from"shared";const le="ACTION_FLOW_ORIGINATION",ie="API_ORIGINATION",ue="active",ce="approved",pe="rejected",de="withdrawn",me="SLACK_ORIGINATION",he="UI_ORIGINATION",je=t.div`
  display: flex;
  gap: ${e=>17*e.theme.space.base}px; /* 68px */
  align-items: flex-end;

  @media (max-width: ${e=>e.theme.breakpoints.md}) {
    flex-direction: column;
    align-items: normal;
    gap: ${e=>4*e.theme.space.base}px; /* 16px */
  }
`,ve=t(u)`
  flex: 3;
`,fe=t(u)`
  flex: 1;
`;var be=e.memo(function({approvalRequestStatus:t,setApprovalRequestStatus:u,setSearchTerm:c}){const{t:p}=s(),d=e.useCallback(e=>{switch(e){case"any":return p("approval-requests.list.status-dropdown.any","Any");case"active":return p("approval-requests.status.decision-pending","Decision pending");case"approved":return p("approval-requests.status.approved","Approved");case"rejected":return p("approval-requests.status.denied","Denied");case"withdrawn":return p("approval-requests.status.withdrawn","Withdrawn")}},[p]),m=e.useCallback(e=>{e.selectionValue&&(u(e.selectionValue),c(""))},[u,c]),h=e.useMemo(()=>n(e=>c(e),300),[c]),j=e.useCallback(e=>{h(e.target.value)},[h]);return a.jsxs(je,{children:[a.jsxs(ve,{children:[a.jsx(ve.Label,{hidden:!0,children:p("approval-requests.list.search-placeholder","Search approval requests")}),a.jsx(r,{start:a.jsx(o,{}),placeholder:p("approval-requests.list.search-placeholder","Search approval requests"),onChange:j})]}),a.jsxs(fe,{children:[a.jsx(fe.Label,{children:p("approval-requests.list.status-dropdown.label_v2","Status")}),a.jsxs(l,{isEditable:!1,onChange:m,selectionValue:t,inputValue:d(t),children:[a.jsx(i,{value:"any",label:p("approval-requests.list.status-dropdown.any","Any")}),a.jsx(i,{value:ue,label:p("approval-requests.status.decision-pending","Decision pending")}),a.jsx(i,{value:ce,label:p("approval-requests.status.approved","Approved")}),a.jsx(i,{value:pe,label:p("approval-requests.status.denied","Denied")}),a.jsx(i,{value:de,label:p("approval-requests.status.withdrawn","Withdrawn")})]})]})]})});const qe={hue:"grey",label:"Unknown status"};var xe=e.memo(function({status:e}){const{t:t}=s(),n={[ue]:{hue:"blue",label:t("approval-requests.status.decision-pending","Decision pending")},[ce]:{hue:"green",label:t("approval-requests.status.approved","Approved")},[pe]:{hue:"red",label:t("approval-requests.status.denied","Denied")},[de]:{hue:"grey",label:t("approval-requests.status.withdrawn","Withdrawn")}}[e]||qe;return a.jsx(c,{hue:n.hue,children:a.jsx(p,{children:n.label})})});const ge=(e,t,s="short")=>{const n=new Date(e);return`${n.toLocaleDateString(t,{month:s,day:"numeric",year:"numeric"})} ${n.toLocaleTimeString(t,{hour:"2-digit",minute:"2-digit",hour12:!1})}`},we=t(m)`
  color: ${({theme:e})=>d({theme:e,hue:"grey",shade:600})};
`;var ye=e.memo(function(){const{t:e}=s();return a.jsx(we,{children:e("approval-requests.list.no-requests","No approval requests found.")})});function ke(e,t){return e.origination_type===le?t("approval-requests.request.approval-request-details.sent-by-action-flow","Action flow"):e.origination_type===ie?t("approval-requests.request.approval-request-details.sent-by-api","API"):"created_by_name"in e?e.created_by_name:e.created_by_user.name}const _e=t(j)`
  &:visited {
    color: ${({theme:e})=>d({theme:e,hue:"blue",shade:600})};
  }
`,$e={style:{paddingTop:"22px",paddingBottom:"22px"},isTruncated:!0};var Ce=e.memo(function({approvalRequests:e,helpCenterPath:t,baseLocale:n,sortDirection:r,onSortChange:o}){const{t:l}=s();return a.jsxs(h,{size:"large",children:[a.jsx(h.Head,{children:a.jsxs(h.HeaderRow,{children:[a.jsx(h.HeaderCell,{width:"40%",isTruncated:!0,children:l("approval-requests.list.table.subject","Subject")}),a.jsx(h.HeaderCell,{isTruncated:!0,children:l("approval-requests.list.table.requester","Requester")}),a.jsx(h.HeaderCell,{isTruncated:!0,children:l("approval-requests.list.table.sent-by","Sent by")}),a.jsx(h.SortableCell,{onClick:()=>{o("asc"===r?"desc":"desc"===r?void 0:"asc")},sort:r,cellProps:$e,children:l("approval-requests.list.table.sent-on","Sent on")}),a.jsx(h.HeaderCell,{isTruncated:!0,children:l("approval-requests.list.table.approval-status","Approval status")})]})}),a.jsx(h.Body,{children:0===e.length?a.jsx(h.Row,{children:a.jsx(h.Cell,{colSpan:5,children:a.jsx(ye,{})})}):e.map(e=>a.jsxs(h.Row,{children:[a.jsx(h.Cell,{isTruncated:!0,children:a.jsx(_e,{href:`${t}/approval_requests/${e.id}`,children:e.subject})}),a.jsx(h.Cell,{isTruncated:!0,children:e.requester_name??e.created_by_name}),a.jsx(h.Cell,{isTruncated:!0,children:ke(e,l)}),a.jsx(h.Cell,{isTruncated:!0,children:ge(e.created_at,n)}),a.jsx(h.Cell,{isTruncated:!0,children:a.jsx(xe,{status:e.status})})]},e.id))})]})});const Re=t.div`
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.space.lg};
  margin-top: ${e=>e.theme.space.xl}; /* 40px */
`,Ae=t.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;var Se=e.memo(function({baseLocale:t,helpCenterPath:n}){const{t:r}=s(),[o,l]=e.useState(""),[i,u]=e.useState(void 0),{approvalRequests:c,errorFetchingApprovalRequests:p,approvalRequestStatus:d,setApprovalRequestStatus:m,isLoading:h}=function(){const[t,s]=e.useState([]),[n,a]=e.useState(null),[r,o]=e.useState(!1),[l,i]=e.useState("any");return e.useEffect(()=>{(async()=>{o(!0);try{const e=await fetch("/api/v2/users/me.json");if(!e.ok)throw new Error("Error fetching current user data");const t=await e.json(),n="01JJQFNX5ADZ6PRQCFWRDNKZRD",a=await fetch(`/api/v2/approval_workflow_instances/${n}/approval_requests/search${"any"===l?"":`?status=${l}`}`,{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-Token":t.user.authenticity_token}});if(!a.ok)throw new Error("Error fetching approval requests");{const e=await a.json();s(e.approval_requests)}}catch(e){a(e)}finally{o(!1)}})()},[l]),{approvalRequests:t,errorFetchingApprovalRequests:n,approvalRequestStatus:l,setApprovalRequestStatus:i,isLoading:r}}(),j=e.useMemo(()=>{let e=[...c];if(o){const t=o.toLowerCase();e=e.filter(e=>e.subject.toLowerCase().includes(t))}return i&&e.sort((e,t)=>{const s=new Date(e.created_at).getTime(),n=new Date(t.created_at).getTime();return"asc"===i?s-n:n-s}),e},[c,o,i]);if(p)throw p;return h?a.jsx(Ae,{children:a.jsx(v,{size:"64"})}):a.jsxs(Re,{children:[a.jsx(f,{isBold:!0,children:r("approval-requests.list.header","Approval requests")}),a.jsx(be,{approvalRequestStatus:d,setApprovalRequestStatus:m,setSearchTerm:l}),0===c.length?a.jsx(ye,{}):a.jsx(Ce,{approvalRequests:j,baseLocale:t,helpCenterPath:n,sortDirection:i,onSortChange:u})]})});async function Ie(e,t,s,n){const{baseLocale:r,locale:o}=s;b(r),await q(o,r,[_("approval-requests",e=>function(e){switch(e){case"./translations/locales/af.json":return import("approval-requests-translations").then(function(e){return e.a});case"./translations/locales/ar-x-pseudo.json":return import("approval-requests-translations").then(function(e){return e.b});case"./translations/locales/ar.json":return import("approval-requests-translations").then(function(e){return e.c});case"./translations/locales/az.json":return import("approval-requests-translations").then(function(e){return e.d});case"./translations/locales/be.json":return import("approval-requests-translations").then(function(e){return e.e});case"./translations/locales/bg.json":return import("approval-requests-translations").then(function(e){return e.f});case"./translations/locales/bn.json":return import("approval-requests-translations").then(function(e){return e.g});case"./translations/locales/bs.json":return import("approval-requests-translations").then(function(e){return e.h});case"./translations/locales/ca.json":return import("approval-requests-translations").then(function(e){return e.i});case"./translations/locales/cs.json":return import("approval-requests-translations").then(function(e){return e.j});case"./translations/locales/cy.json":return import("approval-requests-translations").then(function(e){return e.k});case"./translations/locales/da.json":return import("approval-requests-translations").then(function(e){return e.l});case"./translations/locales/de-de.json":return import("approval-requests-translations").then(function(e){return e.m});case"./translations/locales/de-x-informal.json":return import("approval-requests-translations").then(function(e){return e.n});case"./translations/locales/de.json":return import("approval-requests-translations").then(function(e){return e.o});case"./translations/locales/el.json":return import("approval-requests-translations").then(function(e){return e.p});case"./translations/locales/en-001.json":return import("approval-requests-translations").then(function(e){return e.q});case"./translations/locales/en-150.json":return import("approval-requests-translations").then(function(e){return e.r});case"./translations/locales/en-au.json":return import("approval-requests-translations").then(function(e){return e.s});case"./translations/locales/en-ca.json":return import("approval-requests-translations").then(function(e){return e.t});case"./translations/locales/en-gb.json":return import("approval-requests-translations").then(function(e){return e.u});case"./translations/locales/en-my.json":return import("approval-requests-translations").then(function(e){return e.v});case"./translations/locales/en-ph.json":return import("approval-requests-translations").then(function(e){return e.w});case"./translations/locales/en-se.json":return import("approval-requests-translations").then(function(e){return e.x});case"./translations/locales/en-us.json":return import("approval-requests-translations").then(function(e){return e.y});case"./translations/locales/en-x-dev.json":return import("approval-requests-translations").then(function(e){return e.z});case"./translations/locales/en-x-keys.json":return import("approval-requests-translations").then(function(e){return e.A});case"./translations/locales/en-x-obsolete.json":return import("approval-requests-translations").then(function(e){return e.B});case"./translations/locales/en-x-pseudo.json":return import("approval-requests-translations").then(function(e){return e.C});case"./translations/locales/en-x-test.json":return import("approval-requests-translations").then(function(e){return e.D});case"./translations/locales/es-419.json":return import("approval-requests-translations").then(function(e){return e.E});case"./translations/locales/es-ar.json":return import("approval-requests-translations").then(function(e){return e.F});case"./translations/locales/es-cl.json":return import("approval-requests-translations").then(function(e){return e.G});case"./translations/locales/es-es.json":return import("approval-requests-translations").then(function(e){return e.H});case"./translations/locales/es-mx.json":return import("approval-requests-translations").then(function(e){return e.I});case"./translations/locales/es-pe.json":return import("approval-requests-translations").then(function(e){return e.J});case"./translations/locales/es.json":return import("approval-requests-translations").then(function(e){return e.K});case"./translations/locales/et.json":return import("approval-requests-translations").then(function(e){return e.L});case"./translations/locales/eu.json":return import("approval-requests-translations").then(function(e){return e.M});case"./translations/locales/fa-af.json":return import("approval-requests-translations").then(function(e){return e.N});case"./translations/locales/fa.json":return import("approval-requests-translations").then(function(e){return e.O});case"./translations/locales/fi.json":return import("approval-requests-translations").then(function(e){return e.P});case"./translations/locales/fil.json":return import("approval-requests-translations").then(function(e){return e.Q});case"./translations/locales/fo.json":return import("approval-requests-translations").then(function(e){return e.R});case"./translations/locales/fr-ca.json":return import("approval-requests-translations").then(function(e){return e.S});case"./translations/locales/fr-dz.json":return import("approval-requests-translations").then(function(e){return e.T});case"./translations/locales/fr-mu.json":return import("approval-requests-translations").then(function(e){return e.U});case"./translations/locales/fr.json":return import("approval-requests-translations").then(function(e){return e.V});case"./translations/locales/ga.json":return import("approval-requests-translations").then(function(e){return e.W});case"./translations/locales/gl.json":return import("approval-requests-translations").then(function(e){return e.X});case"./translations/locales/he.json":return import("approval-requests-translations").then(function(e){return e.Y});case"./translations/locales/hi.json":return import("approval-requests-translations").then(function(e){return e.Z});case"./translations/locales/hr.json":return import("approval-requests-translations").then(function(e){return e._});case"./translations/locales/hu.json":return import("approval-requests-translations").then(function(e){return e.$});case"./translations/locales/hy.json":return import("approval-requests-translations").then(function(e){return e.a0});case"./translations/locales/id.json":return import("approval-requests-translations").then(function(e){return e.a1});case"./translations/locales/is.json":return import("approval-requests-translations").then(function(e){return e.a2});case"./translations/locales/it-ch.json":return import("approval-requests-translations").then(function(e){return e.a3});case"./translations/locales/it.json":return import("approval-requests-translations").then(function(e){return e.a4});case"./translations/locales/ja.json":return import("approval-requests-translations").then(function(e){return e.a5});case"./translations/locales/ka.json":return import("approval-requests-translations").then(function(e){return e.a6});case"./translations/locales/kk.json":return import("approval-requests-translations").then(function(e){return e.a7});case"./translations/locales/kl-dk.json":return import("approval-requests-translations").then(function(e){return e.a8});case"./translations/locales/km.json":return import("approval-requests-translations").then(function(e){return e.a9});case"./translations/locales/ko.json":return import("approval-requests-translations").then(function(e){return e.aa});case"./translations/locales/ku.json":return import("approval-requests-translations").then(function(e){return e.ab});case"./translations/locales/ky.json":return import("approval-requests-translations").then(function(e){return e.ac});case"./translations/locales/lt.json":return import("approval-requests-translations").then(function(e){return e.ad});case"./translations/locales/lv.json":return import("approval-requests-translations").then(function(e){return e.ae});case"./translations/locales/mk.json":return import("approval-requests-translations").then(function(e){return e.af});case"./translations/locales/mn.json":return import("approval-requests-translations").then(function(e){return e.ag});case"./translations/locales/ms.json":return import("approval-requests-translations").then(function(e){return e.ah});case"./translations/locales/mt.json":return import("approval-requests-translations").then(function(e){return e.ai});case"./translations/locales/my.json":return import("approval-requests-translations").then(function(e){return e.aj});case"./translations/locales/ne.json":return import("approval-requests-translations").then(function(e){return e.ak});case"./translations/locales/nl-be.json":return import("approval-requests-translations").then(function(e){return e.al});case"./translations/locales/nl.json":return import("approval-requests-translations").then(function(e){return e.am});case"./translations/locales/no.json":return import("approval-requests-translations").then(function(e){return e.an});case"./translations/locales/oc-es.json":return import("approval-requests-translations").then(function(e){return e.ao});case"./translations/locales/oc.json":return import("approval-requests-translations").then(function(e){return e.ap});case"./translations/locales/pl.json":return import("approval-requests-translations").then(function(e){return e.aq});case"./translations/locales/pt-br.json":return import("approval-requests-translations").then(function(e){return e.ar});case"./translations/locales/pt.json":return import("approval-requests-translations").then(function(e){return e.as});case"./translations/locales/ro-md.json":return import("approval-requests-translations").then(function(e){return e.at});case"./translations/locales/ro.json":return import("approval-requests-translations").then(function(e){return e.au});case"./translations/locales/ru.json":return import("approval-requests-translations").then(function(e){return e.av});case"./translations/locales/si.json":return import("approval-requests-translations").then(function(e){return e.aw});case"./translations/locales/sk.json":return import("approval-requests-translations").then(function(e){return e.ax});case"./translations/locales/sl.json":return import("approval-requests-translations").then(function(e){return e.ay});case"./translations/locales/sq.json":return import("approval-requests-translations").then(function(e){return e.az});case"./translations/locales/sr-me.json":return import("approval-requests-translations").then(function(e){return e.aA});case"./translations/locales/sr.json":return import("approval-requests-translations").then(function(e){return e.aB});case"./translations/locales/sv.json":return import("approval-requests-translations").then(function(e){return e.aC});case"./translations/locales/sw-ke.json":return import("approval-requests-translations").then(function(e){return e.aD});case"./translations/locales/ta.json":return import("approval-requests-translations").then(function(e){return e.aE});case"./translations/locales/th.json":return import("approval-requests-translations").then(function(e){return e.aF});case"./translations/locales/tr.json":return import("approval-requests-translations").then(function(e){return e.aG});case"./translations/locales/uk.json":return import("approval-requests-translations").then(function(e){return e.aH});case"./translations/locales/ur-pk.json":return import("approval-requests-translations").then(function(e){return e.aI});case"./translations/locales/ur.json":return import("approval-requests-translations").then(function(e){return e.aJ});case"./translations/locales/uz.json":return import("approval-requests-translations").then(function(e){return e.aK});case"./translations/locales/vi.json":return import("approval-requests-translations").then(function(e){return e.aL});case"./translations/locales/zh-cn.json":return import("approval-requests-translations").then(function(e){return e.aM});case"./translations/locales/zh-tw.json":return import("approval-requests-translations").then(function(e){return e.aN});default:return new Promise(function(t,s){("function"==typeof queueMicrotask?queueMicrotask:setTimeout)(s.bind(null,new Error("Unknown variable dynamic import: "+e)))})}}(`./translations/locales/${e}.json`)),k]),x(e,a.jsx(g,{theme:y(t),children:a.jsx(w,{helpCenterPath:n,children:a.jsx(Se,{...s,helpCenterPath:n})})}))}const Le=t.div`
  border-top: ${({theme:e})=>`1px solid ${d({theme:e,hue:"grey",shade:300})}`};
  display: flex;
  flex-direction: column;
  padding-top: ${e=>4*e.theme.space.base}px; /* 16px */
`,Ue=t(m)`
  margin-bottom: ${e=>e.theme.space.xxs}; /* 4px */
`,Te=t(m)`
  color: ${({theme:e})=>d({theme:e,hue:"grey",shade:600})};
`;function ze(e){switch(e){case ce:return"Approved";case pe:return"Rejected";default:return e}}var Ee=e.memo(function({decision:e,baseLocale:t}){const{t:n}=s();return a.jsxs(Le,{children:[a.jsx(Ue,{children:n("approval-requests.request.approval-request-details.previous-decision","Previous decision")}),a.jsxs(Te,{children:[n(`approval-requests.request.approval-request-details.${e.status.toLowerCase()}`,ze(e.status))," ",ge(e.decided_at??"",t)]}),e.decision_notes&&a.jsx(Te,{children:`"${e.decision_notes}"`})]})});const De=t($)`
  padding: ${e=>6*e.theme.space.base}px; /* 24px */
  margin-left: 0;
  background: ${({theme:e})=>d({theme:e,variable:"background.default"})};
  border-radius: ${e=>e.theme.borderRadii.md}; /* 4px */
  max-width: 296px;

  @media (max-width: ${e=>e.theme.breakpoints.md}) {
    max-width: 100%;
  }
`,Ne=t(m)`
  margin-bottom: ${e=>4*e.theme.space.base}px; /* 16px */
`,Pe=t(m)`
  white-space: normal;
  overflow-wrap: break-word;
`,Be=t(m)`
  color: ${({theme:e})=>d({theme:e,hue:"grey",shade:600})};
`,Fe=t($.Row)`
  margin-bottom: ${e=>e.theme.space.sm}; /* 12px */

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: ${e=>e.theme.breakpoints.sm}) {
    flex-direction: column; /* stack columns vertically */

    > div {
      width: 100% !important; /* full width for each Col */
      max-width: 100% !important;
      flex: none !important;
      margin-bottom: ${e=>e.theme.space.xxs}; /* 4px */
    }

    > div:last-child {
      margin-bottom: 0;
    }
  }
`;var Oe=e.memo(function({approvalRequest:t,baseLocale:n}){const{t:r}=s(),o=e.useCallback((e,t,s)=>String(s?r(e,t,s):r(e,t)),[r]),l=t.status===de?Boolean(t.withdrawn_reason):t.decisions.length>0,i=t.status===de&&t.decisions.length>0,u=t.decided_at?ge(t.decided_at,n):"",c=t.status!==de?function(e,t,s){return e===me?s("approval-requests.request.approval-request-details.via-slack","{{date}} via Slack",{date:t}):e===he?s("approval-requests.request.approval-request-details.via-zendesk","{{date}} via Zendesk",{date:t}):""}(t.decisions[0]?.origination_type,u,o):"";return a.jsxs(De,{children:[a.jsx(Ne,{isBold:!0,children:r("approval-requests.request.approval-request-details.header","Approval request details")}),a.jsxs(Fe,{children:[a.jsx($.Col,{size:4,children:a.jsx(Be,{children:r("approval-requests.request.approval-request-details.sent-by","Sent by")})}),a.jsx($.Col,{size:8,children:a.jsx(Pe,{children:ke(t,o)})})]}),a.jsxs(Fe,{children:[a.jsx($.Col,{size:4,children:a.jsx(Be,{children:r("approval-requests.request.approval-request-details.sent-on","Sent on")})}),a.jsx($.Col,{size:8,children:a.jsx(m,{children:ge(t.created_at,n)})})]}),a.jsxs(Fe,{children:[a.jsx($.Col,{size:4,children:a.jsx(Be,{children:r("approval-requests.request.approval-request-details.approver","Approver")})}),a.jsx($.Col,{size:8,children:a.jsx(Pe,{children:t.assignee_user.name})})]}),a.jsxs(Fe,{children:[a.jsx($.Col,{size:4,children:a.jsx(Be,{children:r("approval-requests.request.approval-request-details.status","Status")})}),a.jsx($.Col,{size:8,children:a.jsx(m,{children:a.jsx(xe,{status:t.status})})})]}),l&&a.jsxs(Fe,{children:[a.jsx($.Col,{size:4,children:a.jsx(Be,{children:r("approval-requests.request.approval-request-details.comment_v2","Reason")})}),a.jsx($.Col,{size:8,children:a.jsx(Pe,{children:t.status===de?t.withdrawn_reason:t.decisions[0]?.decision_notes??"-"})})]}),t.decided_at&&a.jsxs(Fe,{children:[a.jsx($.Col,{size:4,children:a.jsx(Be,{children:r(t.status===de?"approval-requests.request.approval-request-details.withdrawn-on":"approval-requests.request.approval-request-details.decided",t.status===de?"Withdrawn on":"Decided")})}),a.jsx($.Col,{size:8,children:a.jsx(Pe,{children:c||u})})]}),i&&t.decisions[0]&&a.jsx(Ee,{decision:t.decisions[0],baseLocale:n})]})});const Ke=new Set(["application/pdf","image/png","image/jpeg","image/gif","image/webp","image/bmp","text/plain","video/mp4","video/webm","audio/mpeg","audio/mp4","audio/ogg","audio/wav","audio/webm"]);const Ve={pdf:T,image:U,spreadsheet:L,presentation:I,zip:S,document:A,generic:R},Me=t.div`
  margin-top: ${e=>e.theme.space.md}; /* 20px */
`,He=t(m)`
  margin-bottom: ${e=>e.theme.space.xs}; /* 8px */
`,We=t.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${e=>e.theme.space.xs}; /* 8px */

  @media (max-width: ${e=>e.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`,Je=t.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.space.xs}; /* 8px */
  min-width: 0;
  border: ${e=>e.theme.borders.sm}
    ${({theme:e})=>d({theme:e,hue:"grey",shade:300})};
  border-radius: ${e=>e.theme.borderRadii.md}; /* 4px */
  padding: ${e=>`${e.theme.space.xxs} ${e.theme.space.sm}`};
`,Ge=t.div`
  flex-shrink: 0;
  display: inline-flex;

  svg {
    color: ${({theme:e})=>d({theme:e,hue:"grey",shade:600})};
  }
`,Xe=t(m)`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,Ye=C`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: ${e=>e.theme.borderRadii.md}; /* 4px */
  padding: ${e=>e.theme.space.xxs}; /* 4px */

  svg {
    color: ${({theme:e})=>d({theme:e,hue:"grey",shade:600})};
  }

  &:hover svg {
    color: ${({theme:e})=>d({theme:e,hue:"grey",shade:700})};
  }
`,Ze=t(N)`
  ${Ye}
`,Qe=t(N).attrs({isLink:!0})`
  margin-top: ${e=>e.theme.space.sm}; /* 12px */
`,et=t(c)`
  flex-shrink: 0;
`;function tt({attachments:t}){const{t:n}=s(),[r,o]=e.useState(!1),[l,i]=e.useState(null),u=t.length>4,c=r||!u?t:t.slice(0,4),p=t.length-4,d=n("approval-requests.request.ticket-details.attachments.preview-file","Preview file"),m=n("approval-requests.request.ticket-details.attachments.download-file","Download file"),h=n("approval-requests.request.ticket-details.attachments.blocked-file","Blocked"),j=async e=>{const t=await fetch(e.content_url,{signal:AbortSignal.timeout?.call(AbortSignal,3e4)});if(!t.ok)throw new Error("Error fetching attachment");const s=await t.blob();return new Blob([s],{type:e.content_type})},f=async(e,t)=>{i(e.id);try{await t()}finally{i(null)}};return a.jsxs(Me,{children:[a.jsx(He,{isBold:!0,children:n("approval-requests.request.ticket-details.attachments.header","Attachments")}),a.jsx(We,{children:c.map(e=>{const t="malware_found"===e.malware_scan_status,s=(r=e.content_type,Ke.has(r?.toLowerCase()??""));var r;const o=Ve[function(e){const t=e?.toLowerCase()??"";return"application/pdf"===t?"pdf":t.startsWith("image/")?"image":"text/csv"===t||"application/vnd.ms-excel"===t||"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"===t?"spreadsheet":"application/vnd.ms-powerpoint"===t||"application/vnd.openxmlformats-officedocument.presentationml.presentation"===t?"presentation":"application/zip"===t||"application/x-zip-compressed"===t||"application/x-zip"===t?"zip":t.startsWith("text/")||"application/msword"===t||"application/vnd.openxmlformats-officedocument.wordprocessingml.document"===t?"document":"generic"}(e.content_type)];return a.jsxs(Je,{children:[a.jsx(Ge,{"aria-hidden":"true",children:a.jsx(o,{})}),a.jsx(Xe,{title:e.filename,children:e.filename}),t?a.jsx(z,{content:n("approval-requests.request.ticket-details.attachments.blocked-file-tooltip","This file is unavailable because malware was detected"),children:a.jsx(et,{hue:"red",children:h})}):a.jsxs(a.Fragment,{children:[s&&a.jsx(z,{content:d,children:a.jsx(Ze,{isBasic:!0,isPill:!0,focusInset:!0,disabled:l===e.id,onClick:()=>f(e,()=>(async e=>{let t;try{const s=await j(e);t=URL.createObjectURL(s),window.open(t,"_blank","noopener,noreferrer"),setTimeout(()=>URL.revokeObjectURL(t),6e4)}catch{t&&URL.revokeObjectURL(t),window.open(e.content_url,"_blank","noopener,noreferrer")}})(e)),"aria-label":n("approval-requests.request.ticket-details.attachments.preview-file-aria-label","Preview file: {{fileName}}",{fileName:e.filename}),children:l===e.id?a.jsx(v,{size:"small"}):a.jsx(E,{"aria-hidden":"true"})})}),a.jsx(z,{content:m,children:a.jsx(Ze,{isBasic:!0,isPill:!0,focusInset:!0,disabled:l===e.id,onClick:()=>f(e,()=>(async e=>{let t;try{const s=await j(e);t=URL.createObjectURL(s);const n=document.createElement("a");n.href=t,n.download=e.filename,document.body.appendChild(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(t),6e4)}catch{t&&URL.revokeObjectURL(t),window.open(e.content_url,"_blank","noopener,noreferrer")}})(e)),"aria-label":n("approval-requests.request.ticket-details.attachments.download-file-aria-label","Download file: {{fileName}}",{fileName:e.filename}),children:l===e.id?a.jsx(v,{size:"small"}):a.jsx(D,{"aria-hidden":"true"})})})]})]},e.id)})}),u&&p>0&&(r?a.jsx(Qe,{onClick:()=>o(!1),"aria-label":n("approval-requests.request.ticket-details.attachments.show-less-aria-label","Show fewer attachments"),children:n("approval-requests.request.ticket-details.attachments.show-less","Show less")}):a.jsx(Qe,{onClick:()=>o(!0),"aria-label":n("approval-requests.request.ticket-details.attachments.show-more-aria-label","Show {{count}} more attachments",{count:p}),children:n("approval-requests.request.ticket-details.attachments.show-more","+{{count}} more",{count:p})}))]})}const st=t($)`
  padding: ${e=>e.theme.space.md}; /* 20px */
  border: ${e=>e.theme.borders.sm}
    ${({theme:e})=>d({theme:e,hue:"grey",shade:300})};
  border-radius: ${e=>e.theme.borderRadii.md}; /* 4px */
`,nt=t(m)`
  margin-bottom: ${e=>e.theme.space.md}; /* 20px */
`,at=t(m)`
  color: ${({theme:e})=>d({theme:e,hue:"grey",shade:600})};
`,rt=t(c)`
  margin-inline-end: ${e=>e.theme.space.xxs}; /* 4px */
`,ot=t.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${e=>e.theme.space.md}; /* 20px */
  margin-top: ${e=>e.theme.space.md}; /* 20px */

  @media (max-width: ${e=>e.theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;function lt({value:e}){const{t:t}=s();return Array.isArray(e)&&e.length>0?a.jsx(m,{children:e.map(e=>a.jsx(rt,{hue:"grey",children:e},e))}):"boolean"==typeof e?a.jsx(m,{children:e?t("approval-requests.request.ticket-details.checkbox-value.yes","Yes"):t("approval-requests.request.ticket-details.checkbox-value.no","No")}):!e||Array.isArray(e)&&0===e.length?a.jsx(m,{children:"-"}):a.jsx(m,{children:e})}const it={Low:"approval-requests.request.ticket-details.priority_low",Normal:"approval-requests.request.ticket-details.priority_normal",High:"approval-requests.request.ticket-details.priority_high",Urgent:"approval-requests.request.ticket-details.priority_urgent"};var ut=e.memo(function({ticket:e,attachments:t}){const{t:n}=s(),r=it[e.priority]?n(it[e.priority],e.priority):e.priority;return a.jsxs(st,{children:[a.jsx(nt,{isBold:!0,children:n("approval-requests.request.ticket-details.header","Ticket details")}),a.jsxs(ot,{children:[a.jsxs("div",{children:[a.jsx(at,{children:n("approval-requests.request.ticket-details.requester","Requester")}),a.jsx(m,{children:e.requester.name})]}),a.jsxs("div",{children:[a.jsx(at,{children:n("approval-requests.request.ticket-details.id","ID")}),a.jsx(m,{children:e.id})]}),a.jsxs("div",{children:[a.jsx(at,{children:n("approval-requests.request.ticket-details.priority","Priority")}),a.jsx(m,{children:r})]}),e.custom_fields.map(e=>a.jsxs("div",{children:[a.jsx(at,{children:e.title_in_portal}),a.jsx(lt,{value:e.value})]},String(e.id)))]}),t&&t.length>0&&a.jsx(tt,{attachments:t})]})});const ct="APPROVED",pt="REJECTED",dt=t.div`
  display: flex;
  flex-direction: row;
  gap: ${e=>e.theme.space.md}; /* 20px */
  margin-inline-start: ${e=>e.$hasAvatar?"55px":"0"}; // avatar width + margin + border

  @media (max-width: ${e=>e.theme.breakpoints.md}) {
    flex-direction: ${e=>e.$isSubmitButton?"row-reverse":"column"};
    gap: ${e=>4*e.theme.space.base}px; /* 16px */
  }
`,mt=t.div`
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.space.lg}; /* 32px */

  @media (max-width: ${e=>e.theme.breakpoints.md}) {
    gap: ${e=>4*e.theme.space.base}px; /* 16px */
  }
`,ht=t.div`
  display: flex;
  gap: ${e=>4*e.theme.space.base}px; /* 16px */
  margin-top: ${e=>6*e.theme.space.base}px; /* 24px */
  align-items: flex-start;
`,jt=t.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;var vt=e.memo(function({approvalRequestId:t,approvalWorkflowInstanceId:n,setApprovalRequest:r,assigneeUser:o}){const{t:l}=s(),[i,u]=e.useState(""),[c,p]=e.useState(null),[d,m]=e.useState(!1),[h,j]=e.useState(!1),v=c!==pt||""!==i.trim(),f=h&&!v,b=e.useCallback(()=>{p(ct),j(!1)},[]),q=e.useCallback(()=>{p(pt),j(!1)},[]),x=e.useCallback(e=>{u(e.target.value)},[]),g=e.useCallback(()=>{p(null),u(""),j(!1)},[]),w=async()=>{if(j(!0),c&&v){m(!0);try{const e=c===ct?ce:pe,s=await async function(e,t,s,n){try{const a=await fetch("/api/v2/users/me.json");if(!a.ok)throw new Error("Error fetching current user data");const r=await a.json();return await fetch(`/api/v2/approval_workflow_instances/${e}/approval_requests/${t}/decision`,{method:"PATCH",headers:{"Content-Type":"application/json","X-CSRF-Token":r.user.authenticity_token},body:JSON.stringify({status:s,notes:n})})}catch(e){throw console.error("Error submitting approval decision:",e),e}}(n,t,e,i);if(!s.ok)throw new Error(`Failed to submit ${e} decision`);{const t=await s.json();r(t.approval_request);const n=e===ce?l("approval-requests.request.notification.approval-submitted","Approval submitted"):l("approval-requests.request.notification.denial-submitted","Denial submitted");O({type:"success",title:n,message:""})}}catch(e){O({type:"error",title:"Error submitting decision",message:"Please try again later"})}finally{m(!1)}}};if(c){const e=c===ct?l("approval-requests.request.approver-actions.additional-note-label","Additional note"):l("approval-requests.request.approver-actions.denial-reason-label","Reason for denial* (Required)"),t=Boolean(o?.photo?.content_url);return a.jsxs(mt,{children:[a.jsxs(P,{children:[a.jsx(P.Label,{children:e}),a.jsxs(ht,{children:[t&&a.jsx(B,{children:a.jsx("img",{alt:"Assignee avatar",src:o.photo.content_url??void 0})}),a.jsxs(jt,{children:[a.jsx(F,{minRows:5,value:i,onChange:x,disabled:d,validation:f?"error":void 0}),f&&a.jsx(P.Message,{validation:"error",children:l("approval-requests.request.approver-actions.denial-reason-validation","Enter a reason for denial")})]})]})]}),a.jsxs(dt,{$hasAvatar:t,$isSubmitButton:!0,children:[a.jsx(N,{isPrimary:!0,onClick:w,disabled:d,children:c===ct?l("approval-requests.request.approver-actions.submit-approval","Submit approval"):l("approval-requests.request.approver-actions.submit-denial","Submit denial")}),a.jsx(N,{onClick:g,disabled:d,children:l("approval-requests.request.approver-actions.cancel","Cancel")})]})]})}return a.jsxs(dt,{children:[a.jsx(N,{isPrimary:!0,onClick:b,children:l("approval-requests.request.approver-actions.approve-request","Approve request")}),a.jsx(N,{onClick:q,children:l("approval-requests.request.approver-actions.deny-request","Deny request")})]})});const ft=t(K)`
  margin-top: ${e=>e.theme.space.lg}; /* 32px */
`,bt=t(j)`
  &:visited {
    color: ${({theme:e})=>d({theme:e,hue:"blue",shade:600})};
  }
`;var qt=e.memo(function({organizations:e,helpCenterPath:t}){const{t:n}=s(),r=e.length>0?e[0]?.name:null;return r?a.jsxs(ft,{children:[a.jsx(bt,{href:t,children:r}),a.jsx(bt,{href:`${t}/approval_requests`,children:n("approval-requests.list.header","Approval requests")})]}):a.jsx(ft,{children:a.jsx(bt,{href:`${t}/approval_requests`,children:n("approval-requests.list.header","Approval requests")})})});const xt=()=>{const{t:e}=s();return{title:e("txt.approval_requests.clarification.title","Comments"),description:e("txt.approval_requests.clarification.description","Add notes or ask for additional information about this request"),comment_form_aria_label:e("txt.approval_requests.clarification.comment_form_aria_label","Enter a comment to ask for additional information about this approval request"),submit_button:e("txt.approval_requests.clarification.submit_button","Send"),cancel_button:e("txt.approval_requests.clarification.cancel_button","Cancel"),validation_empty_input:e("txt.approval_requests.clarification.validation_empty_comment_error","Enter a comment")}},gt=500,wt="https://secure.gravatar.com/avatar/6d713fed56e4dd3e48f6b824b8789d7f?default=https%3A%2F%2Fassets.zendesk.com%2Fhc%2Fassets%2Fdefault_avatar.png&r=g",yt=t($)`
  margin-top: ${({theme:e})=>e.space.xs};
  padding-top: ${({theme:e})=>e.space.md};
`,kt=t(M)`
  max-width: 55px;
`,_t=t(V)`
  margin-top: 10px;
  margin-left: 55px;
`,$t=t(N)`
  margin: 10px;
`;function Ct({baseLocale:t,currentUserAvatarUrl:n,currentUserName:r,markAllCommentsAsRead:o,approvalRequestId:l,onUpdatedComments:i}){const{comment_form_aria_label:u,submit_button:c,cancel_button:p,validation_empty_input:d}=xt(),{submitComment:m,isLoading:h=!1}=(()=>{const[t,s]=e.useState(!1);return{submitComment:async(e,t)=>{s(!0);try{const s=await fetch("/api/v2/users/me.json");if(!s.ok)throw new Error("Error fetching current user data");const n=await s.json(),a=await fetch("/api/v2/approval_clarification_flow_messages",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-Token":n.user.authenticity_token},body:JSON.stringify({approval_request_id:e,message:t})});if(!a.ok)throw new Error(`Failed to submit comment: ${a.status}`);return{success:!0,data:(await a.json()).clarification_flow_messages}}finally{s(!1)}},isLoading:t}})(),{buttonsContainerRef:j,comment:v,commentValidation:f,charLimitMessage:b,handleBlur:q,handleCancel:x,handleFocus:g,handleKeyDown:w,handleSubmit:y,handleChange:k,isInputFocused:_,textareaRef:$}=(({onSubmit:t,baseLocale:n,markAllCommentsAsRead:a,approvalRequestId:r})=>{const o=e.useRef(null),l=e.useRef(null),[i,u]=e.useState(""),[c,p]=e.useState(),[d,m]=e.useState(!1),[h,j]=e.useState(""),{t:v}=s(),f=()=>{u(""),p(void 0),j(""),m(!1),o.current?.blur()},b=e.useCallback(async()=>{if(!(i.trim().length>0))return p("error"),o.current?.focus(),!1;try{return await t(r,i),a(),f(),!0}catch(e){return console.error(e),!1}},[i,a,t]),q=e.useCallback(async e=>{const t=(e.ctrlKey||e.metaKey)&&"c"===e.key.toLowerCase(),s=(e.ctrlKey||e.metaKey)&&"a"===e.key.toLowerCase(),n=(e.ctrlKey||e.metaKey)&&"x"===e.key.toLowerCase(),a=(e.ctrlKey||e.metaKey)&&"z"===e.key.toLowerCase();!(i.length>=gt)||["Backspace","Delete","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Tab","Enter","Escape","Home","End"].includes(e.key)||t||s||n||a?"Enter"===e.key&&!1===e.shiftKey?(e.preventDefault(),await b()):"Escape"===e.key&&(e.preventDefault(),f()):e.preventDefault()},[i.length,b]),x=e.useCallback(e=>{let t=e.target.value;t.length>gt&&(t=t.substring(0,gt)),u(t),m(!0);const s=gt-t.length;if(s>=0&&s<=10){const e=new Intl.PluralRules(n).select(s);p("warning"),j(v(`txt.approval_requests.validation.characters_remaining.${e}`,{numCharacters:s,defaultValue:`${s} character${"one"===e?"":"s"} remaining`}))}else"warning"===c&&(p(void 0),j(""));"error"===c&&t.trim().length>0&&p(void 0)},[n,c,v]);return{textareaRef:o,buttonsContainerRef:l,charLimitMessage:h,comment:i,commentValidation:c,isInputFocused:d,setComment:u,handleBlur:e=>{const t=e?.relatedTarget;t&&l.current?.contains(t)||m(!1)},handleCancel:f,handleChange:x,handleFocus:()=>{m(!0)},handleKeyDown:q,handleSubmit:b}})({onSubmit:async(e,t)=>{const s=await m(e,t);s.success&&s.data&&i(s.data)},baseLocale:t,markAllCommentsAsRead:o,approvalRequestId:l});return a.jsxs(yt,{gutters:!1,children:[a.jsxs(V,{children:[a.jsx(kt,{children:a.jsx(B,{size:"small",children:a.jsx("img",{alt:r,src:n||wt})})}),a.jsx(M,{children:a.jsxs(P,{children:[a.jsx(H,{hidden:!0,children:u}),a.jsx(F,{ref:$,validation:f,minRows:_||v.trim().length>0?4:1,maxRows:4,value:v,onChange:k,onKeyDown:w,onBlur:q,onFocus:g}),a.jsx(W,{validation:f,children:"error"===f?d:"warning"===f?b:null})]})})]}),(_||v.trim().length>0)&&a.jsx(_t,{ref:j,children:a.jsxs(M,{textAlign:"start",children:[a.jsx(N,{disabled:h,onClick:y,children:c}),a.jsx($t,{disabled:h,onClick:x,isBasic:!0,children:p})]})})]})}const Rt=(e,t)=>`zenGuide:approvalRequest:${e}:comment:${t.id}`;const At=t.div`
  align-items: center;
  color: ${({theme:e})=>d({theme:e,hue:"red",shade:600})};
  display: flex;
  font-size: ${({theme:e})=>e.fontSizes.md};
  text-align: center;
  padding-top: ${({theme:e})=>e.space.sm};
  padding-bottom: ${({theme:e})=>e.space.xxs};

  &:before,
  &:after {
    content: "";
    flex: 1;
    border-bottom: 1px solid
      ${e=>d({theme:e.theme,hue:"red",shade:600})};
  }

  &:before {
    margin-right: 16px;
  }

  &:after {
    margin-left: 16px;
  }
`;function St({unreadCount:e}){const{t:t}=s();return a.jsx(At,{children:1===e?t("txt.approval_requests.clarification.new_comment_indicator","New comment"):t("txt.approval_requests.clarification.new_comments_indicator","New comments")})}const It=new Map;let Lt=null;const Ut=(t,s)=>{const n=e.useCallback(()=>{const e=t.current;if(!e)return;const n=Lt||(Lt=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){const t=It.get(e.target);t&&(t(),Lt?.unobserve(e.target),It.delete(e.target))}})},{threshold:1}),Lt);It.set(e,s),n.observe(e)},[t,s]),a=e.useCallback(()=>{const e=t.current;e&&Lt&&(Lt.unobserve(e),It.delete(e))},[t]);e.useEffect(()=>(n(),()=>a()),[n,a])},Tt=t(Q)`
  color: ${({theme:e})=>d({theme:e,hue:"grey",shade:600})};
  align-self: center;
  justify-content: center;
  padding-top: 1px;
`;const zt=({eventTime:t,locale:n})=>{const{t:r}=s(),o=e.useMemo(()=>function(e){return new Intl.DateTimeFormat(e,{hour:"numeric"}).resolvedOptions().hour12??!0}(n),[n]),l=new Date,i=new Date(t);if(isNaN(i.getTime()))return null;const u=J(l,i),c=G(l,i);if(u<0||u<60)return a.jsx(Tt,{children:(r("approval_request.clarification.timestamp_lessThanAMinuteAgo"),"< 1 minute ago")});if(c<60){const e=new Intl.PluralRules(n).select(c);return a.jsx(Tt,{children:(r("approval_request.clarification.timestamp_minutesAgo",{count:c,plural:e}),`${c} minute${"one"===e?"":"s"} ago`)})}const p=((e,t,s)=>e.toLocaleTimeString(t,{hour:"numeric",minute:"2-digit",hour12:s}))(i,n,o);if(Y(i,l))return a.jsx(Tt,{children:(r("approval_request.clarification.timestamp_todayAt",{time:p}),`Today at ${p}`)});if(((e,t)=>{const s=Z(t,1);return Y(e,s)})(i,l))return a.jsx(Tt,{children:(r("approval_request.clarification.timestamp_yesterdayAt",{time:p}),`Yesterday at ${p}`)});if(X(i,l)){const e=((e,t)=>e.toLocaleDateString(t,{month:"short",day:"2-digit"}))(i,n);return a.jsx(Tt,{children:(r("approval_request.clarification.timestamp_dateAt",{date:e,time:p}),`${e} at ${p}`)})}const d=((e,t)=>e.toLocaleDateString(t,{month:"short",day:"2-digit",year:"numeric"}))(i,n);return a.jsx(Tt,{children:(r("approval_request.clarification.timestamp_dateAt",{date:d,time:p}),`${d} at ${p}`)})},Et=t.div`
  position: relative;
  display: inline-block;
`,Dt=t.div`
  position: absolute;
  bottom: -3px;
  right: -3px;
  border-radius: 50%;
  width: 13px;
  height: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({theme:e})=>d({theme:e,hue:"grey",shade:100})};
  border: ${({theme:e})=>e.borders.sm};
`,Nt=t(ee)`
  width: 9px;
  height: 9px;
  color: ${({theme:e})=>d({theme:e,hue:"grey",shade:900})};
`,Pt=({name:e,photoUrl:t,size:s})=>a.jsxs(Et,{children:[a.jsx(B,{size:s,children:a.jsx("img",{alt:e,src:t||wt})}),a.jsx(Dt,{children:a.jsx(Nt,{})})]}),Bt=t.div`
  margin-top: ${({theme:e})=>e.space.sm};
`,Ft=t.div`
  margin-top: ${({theme:e})=>e.space.xs};
`,Ot=t(M)`
  max-width: 55px;
`,Kt=t.span`
  padding: 0px 6px;
`,Vt=t(M)`
  display: flex;
  flex-direction: row;
  align-items: start;
`,Mt=t(te)`
  width: ${({theme:e})=>e.space.xs};
  height: ${({theme:e})=>e.space.xs};
  color: ${({theme:e})=>d({theme:e,hue:"grey",shade:600})};
`;const Ht=e.memo(function({baseLocale:t,children:s,comment:n,commentKey:r,createdByUserId:o,markCommentAsVisible:l}){const i=e.useRef(null),{author:u,created_at:c}=n,{avatar:p,name:d,id:h}=u;Ut(i,()=>l(r));const j=o===h;return a.jsx(Bt,{ref:i,children:a.jsx($,{gutters:!1,children:a.jsxs(V,{children:[a.jsx(Ot,{children:j?a.jsx(Pt,{photoUrl:p,size:"small",name:d}):a.jsx(B,{size:"small",children:a.jsx("img",{alt:d,src:p||wt})})}),a.jsxs(M,{children:[a.jsx(V,{alignItems:"start",justifyContent:"start",children:a.jsxs(Vt,{children:[a.jsx(m,{isBold:!0,children:d}),a.jsx(Kt,{children:a.jsx(Mt,{})}),c&&a.jsx(zt,{eventTime:c,locale:t})]})}),a.jsx(Ft,{children:s})]})]})})})}),Wt=t(ae)`
  margin-top: ${({theme:e})=>e.space.md};
  padding: ${({theme:e})=>e.space.md} ${({theme:e})=>e.space.xl};
`,Jt=({approvalRequestId:t,commentCount:n,currentUserId:r,isTerminalStatus:o})=>{const{t:l}=s(),i=`nearLimitAlertDismissed_${r}_${t}`,[u,c]=e.useState(()=>"true"!==localStorage.getItem(i)),p=n>=40,d=n>=35&&n<40&&u,m=40-n,h=e.useCallback(()=>{localStorage.setItem(i,"true"),c(!1)},[i]);if(!o){if(p)return a.jsxs(Wt,{type:"info",children:[a.jsx(se,{children:l("txt.approval_requests.clarification.max_comment_alert_title","Comment limit reached")}),l("txt.approval_requests.clarification.max_comment_alert_message","You can't add more comments, approvers can still approve or deny.")]});if(d)return a.jsxs(Wt,{type:"info",children:[a.jsx(se,{children:l("txt.approval_requests.clarification.near_comment_limit_alert_title","Comment limit nearly reached")}),(l("txt.approval_requests.panel.single_approval_request.clarification.near_comment_limit_alert_message",{current_count:n,remaining_count:m}),`This request has ${n} of 40 comments available. You have ${m} remaining.`),a.jsx(ne,{onClick:h,"aria-label":l("txt.approval_requests.panel.single_approval_request.clarification.close_alert_button_aria_label","Close alert")})]})}return null},Gt=t.div`
  display: flex;
  flex-direction: column;
  border-top: ${({$showCommentHeader:e,theme:t})=>e?`1px solid ${d({theme:t,hue:"grey",shade:200})}`:"none"};
  padding-top: 16px;
`,Xt=t.div`
  flex: 1 1 auto;
`,Yt=t(m)`
  padding: ${({theme:e})=>e.space.xxs} 0;
  overflow-wrap: break-word;
  white-space: normal;
`,Zt=t.div`
  padding-bottom: 16px;
`,Qt=t(m)`
  padding-top: ${({theme:e})=>e.space.xxs};
  color: ${e=>re("grey",600,e.theme)};
`;function es({approvalRequestId:t,baseLocale:s,clarificationFlowMessages:n,createdByUserId:r,currentUserAvatarUrl:o,currentUserId:l,currentUserName:i,hasUserViewedBefore:u,status:c}){const p=xt(),[d,h]=e.useState(n),j=d&&d.length>0,v=!!c&&("withdrawn"===c||"approved"===c||"rejected"===c),f=!v&&d.length<40,b=!v||j,{unreadComments:q,firstUnreadCommentKey:x,markCommentAsVisible:g,markAllCommentsAsRead:w}=function({comments:t,currentUserId:s,approvalRequestId:n}){const a=window.localStorage,r=`readComments:${s}:${n}`,o=e.useCallback(()=>{try{const e=a.getItem(r);return e?JSON.parse(e):{}}catch{return{}}},[r,a]),l=e.useCallback(e=>{try{a.setItem(r,JSON.stringify(e))}catch{}},[r,a]),[i,u]=e.useState(()=>o());e.useEffect(()=>{u(o())},[n,o]);const c=e.useCallback(()=>{u(e=>{const t={...e};return Object.keys(t).forEach(e=>{t[e]?.visible&&(t[e]={...t[e],read:!0})}),l(t),t})},[l]),{unreadComments:p,firstUnreadCommentKey:d}=e.useMemo(()=>{const e=t.filter(e=>String(e.author.id)!==String(s)).filter(e=>{const t=Rt(n,e),s=i[t];return!s?.read});return{unreadComments:e,firstUnreadCommentKey:e[0]?Rt(n,e[0]):null}},[t,i,s,n]);return{firstUnreadCommentKey:d,markCommentAsVisible:e=>{const t={...i};t[e]?.visible||(t[e]={...t[e],visible:!0,read:t[e]?.read??!1},l(t),u(t))},markAllCommentsAsRead:c,unreadComments:p}}({comments:d,currentUserId:l,approvalRequestId:t});e.useEffect(()=>{const e=()=>{w()};return window.addEventListener("beforeunload",e),()=>{window.removeEventListener("beforeunload",e)}},[w]);const y=e.useCallback(e=>{h(e)},[]);return a.jsxs(Gt,{$showCommentHeader:b,children:[b&&a.jsxs(Zt,{children:[a.jsx(m,{isBold:!0,children:p.title}),f&&a.jsx(Qt,{children:p.description})]}),a.jsx(Xt,{"data-testid":"comment-list-area",children:j&&d.map(e=>{const n=Rt(t,e),o=n===x,l=q.length;return a.jsxs(oe.Fragment,{children:[!v&&l>0&&o&&u&&a.jsx(St,{unreadCount:l}),a.jsx(Yt,{children:a.jsx(Ht,{baseLocale:s,comment:e,commentKey:n,createdByUserId:r,markCommentAsVisible:g,children:e.message})},e.id)]},`${e.id}`)})}),a.jsx(Jt,{approvalRequestId:t,commentCount:d.length,currentUserId:l,isTerminalStatus:v}),f&&a.jsx(Ct,{baseLocale:s,currentUserAvatarUrl:o,currentUserName:i,markAllCommentsAsRead:w,approvalRequestId:t,onUpdatedComments:y})]})}const ts=t.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-areas:
    "left right"
    "approverActions right"
    "clarification right";

  grid-gap: ${e=>e.theme.space.lg};
  margin-top: ${e=>e.theme.space.xl}; /* 40px */
  margin-bottom: ${e=>e.theme.space.lg}; /* 32px */

  @media (max-width: ${e=>e.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    grid-template-areas:
      "left"
      "right"
      "approverActions"
      "clarification";
    margin-bottom: ${e=>e.theme.space.xl};
  }
`,ss=t.div`
  display: flex;
  justify-content: center;
  align-items: center;
`,ns=t.div`
  grid-area: left;

  & > *:first-child {
    margin-bottom: ${e=>4*e.theme.space.base}px; /* 16px */
  }

  & > *:not(:first-child) {
    margin-bottom: ${e=>e.theme.space.lg}; /* 32px */
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`,as=t.div`
  grid-area: right;
`,rs=t.div`
  grid-area: clarification;
`,os=t.div`
  grid-area: approverActions;
  margin-top: ${e=>e.theme.space.lg};
`,ls=t(m)`
  white-space: pre-wrap;
`;var is=e.memo(function({approvalWorkflowInstanceId:t,approvalRequestId:s,baseLocale:n,helpCenterPath:r,organizations:o,userId:l,userAvatarUrl:i,userName:u}){const{approvalRequest:c,setApprovalRequest:p,errorFetchingApprovalRequest:d,isLoading:m}=function({approvalWorkflowInstanceId:t,approvalRequestId:s,enablePolling:n}){const[a,r]=e.useState(),[o,l]=e.useState(null),[i,u]=e.useState(!1),c=e.useRef(!0),p=!(a?.status&&("withdrawn"===a?.status||"approved"===a?.status||"rejected"===a?.status)),d=e.useCallback(async()=>{c.current&&u(!0);try{const e=await fetch(`/api/v2/approval_workflow_instances/${t}/approval_requests/${s}`);if(!e.ok)throw new Error("Error fetching approval request");{const t=await e.json();r(t.approval_request)}}catch(e){l(e)}finally{c.current&&(u(!1),c.current=!1)}},[s,t]);return e.useEffect(()=>{d()},[s,t]),e.useEffect(()=>{if(p){const e=setInterval(()=>{d()},1e4);return()=>{clearInterval(e)}}},[d,p]),{approvalRequest:a,errorFetchingApprovalRequest:o,isLoading:i,setApprovalRequest:r}}({approvalWorkflowInstanceId:t,approvalRequestId:s,enablePolling:!0}),{hasUserViewedBefore:h,markUserViewed:j}=function({approvalRequestId:t,currentUserId:s}){const n=void 0!==t,a=window.localStorage,r=`userViewedApproval:${s}:${t}`,o=e.useCallback(()=>{if(!n)return!1;try{return"true"===a.getItem(r)}catch{return!1}},[n,a,r]),[l,i]=e.useState(()=>o()),u=e.useCallback(()=>{if(n)try{a.setItem(r,"true"),i(!0)}catch{}},[n,a,r]);return e.useEffect(()=>{n&&i(o())},[t,s,o,n]),{hasUserViewedBefore:l,markUserViewed:u}}({approvalRequestId:c?.id,currentUserId:l});if(e.useEffect(()=>{const e=()=>{j()};return window.addEventListener("beforeunload",e),()=>{window.removeEventListener("beforeunload",e)}},[j]),d)throw d;if(m||!c)return a.jsx(ss,{children:a.jsx(v,{size:"64"})});const b=l===c.assignee_user.id&&"active"===c.status,q=void 0!==c?.clarification_flow_messages,x=c.message.replace(/\n{3,}/g,"\n\n");return a.jsxs(a.Fragment,{children:[a.jsx(qt,{helpCenterPath:r,organizations:o}),a.jsxs(ts,{children:[a.jsxs(ns,{children:[a.jsx(f,{isBold:!0,children:c.subject}),a.jsx(ls,{children:x}),c.ticket_details&&a.jsx(ut,{ticket:c.ticket_details,attachments:c.attachments})]}),a.jsx(as,{children:c&&a.jsx(Oe,{approvalRequest:c,baseLocale:n})}),b&&a.jsx(os,{children:a.jsx(vt,{approvalWorkflowInstanceId:t,approvalRequestId:s,setApprovalRequest:p,assigneeUser:c.assignee_user})}),q&&a.jsx(rs,{children:a.jsx(es,{approvalRequestId:c.id,baseLocale:n,clarificationFlowMessages:c.clarification_flow_messages,createdByUserId:c.created_by_user.id,currentUserAvatarUrl:i,currentUserId:l,currentUserName:u,hasUserViewedBefore:h,status:c.status},c?.clarification_flow_messages?.length)})]})]})});async function us(e,t,s,n){const{baseLocale:r,locale:o}=s;b(r),await q(o,r,[_("approval-requests",e=>function(e){switch(e){case"./translations/locales/af.json":return import("approval-requests-translations").then(function(e){return e.a});case"./translations/locales/ar-x-pseudo.json":return import("approval-requests-translations").then(function(e){return e.b});case"./translations/locales/ar.json":return import("approval-requests-translations").then(function(e){return e.c});case"./translations/locales/az.json":return import("approval-requests-translations").then(function(e){return e.d});case"./translations/locales/be.json":return import("approval-requests-translations").then(function(e){return e.e});case"./translations/locales/bg.json":return import("approval-requests-translations").then(function(e){return e.f});case"./translations/locales/bn.json":return import("approval-requests-translations").then(function(e){return e.g});case"./translations/locales/bs.json":return import("approval-requests-translations").then(function(e){return e.h});case"./translations/locales/ca.json":return import("approval-requests-translations").then(function(e){return e.i});case"./translations/locales/cs.json":return import("approval-requests-translations").then(function(e){return e.j});case"./translations/locales/cy.json":return import("approval-requests-translations").then(function(e){return e.k});case"./translations/locales/da.json":return import("approval-requests-translations").then(function(e){return e.l});case"./translations/locales/de-de.json":return import("approval-requests-translations").then(function(e){return e.m});case"./translations/locales/de-x-informal.json":return import("approval-requests-translations").then(function(e){return e.n});case"./translations/locales/de.json":return import("approval-requests-translations").then(function(e){return e.o});case"./translations/locales/el.json":return import("approval-requests-translations").then(function(e){return e.p});case"./translations/locales/en-001.json":return import("approval-requests-translations").then(function(e){return e.q});case"./translations/locales/en-150.json":return import("approval-requests-translations").then(function(e){return e.r});case"./translations/locales/en-au.json":return import("approval-requests-translations").then(function(e){return e.s});case"./translations/locales/en-ca.json":return import("approval-requests-translations").then(function(e){return e.t});case"./translations/locales/en-gb.json":return import("approval-requests-translations").then(function(e){return e.u});case"./translations/locales/en-my.json":return import("approval-requests-translations").then(function(e){return e.v});case"./translations/locales/en-ph.json":return import("approval-requests-translations").then(function(e){return e.w});case"./translations/locales/en-se.json":return import("approval-requests-translations").then(function(e){return e.x});case"./translations/locales/en-us.json":return import("approval-requests-translations").then(function(e){return e.y});case"./translations/locales/en-x-dev.json":return import("approval-requests-translations").then(function(e){return e.z});case"./translations/locales/en-x-keys.json":return import("approval-requests-translations").then(function(e){return e.A});case"./translations/locales/en-x-obsolete.json":return import("approval-requests-translations").then(function(e){return e.B});case"./translations/locales/en-x-pseudo.json":return import("approval-requests-translations").then(function(e){return e.C});case"./translations/locales/en-x-test.json":return import("approval-requests-translations").then(function(e){return e.D});case"./translations/locales/es-419.json":return import("approval-requests-translations").then(function(e){return e.E});case"./translations/locales/es-ar.json":return import("approval-requests-translations").then(function(e){return e.F});case"./translations/locales/es-cl.json":return import("approval-requests-translations").then(function(e){return e.G});case"./translations/locales/es-es.json":return import("approval-requests-translations").then(function(e){return e.H});case"./translations/locales/es-mx.json":return import("approval-requests-translations").then(function(e){return e.I});case"./translations/locales/es-pe.json":return import("approval-requests-translations").then(function(e){return e.J});case"./translations/locales/es.json":return import("approval-requests-translations").then(function(e){return e.K});case"./translations/locales/et.json":return import("approval-requests-translations").then(function(e){return e.L});case"./translations/locales/eu.json":return import("approval-requests-translations").then(function(e){return e.M});case"./translations/locales/fa-af.json":return import("approval-requests-translations").then(function(e){return e.N});case"./translations/locales/fa.json":return import("approval-requests-translations").then(function(e){return e.O});case"./translations/locales/fi.json":return import("approval-requests-translations").then(function(e){return e.P});case"./translations/locales/fil.json":return import("approval-requests-translations").then(function(e){return e.Q});case"./translations/locales/fo.json":return import("approval-requests-translations").then(function(e){return e.R});case"./translations/locales/fr-ca.json":return import("approval-requests-translations").then(function(e){return e.S});case"./translations/locales/fr-dz.json":return import("approval-requests-translations").then(function(e){return e.T});case"./translations/locales/fr-mu.json":return import("approval-requests-translations").then(function(e){return e.U});case"./translations/locales/fr.json":return import("approval-requests-translations").then(function(e){return e.V});case"./translations/locales/ga.json":return import("approval-requests-translations").then(function(e){return e.W});case"./translations/locales/gl.json":return import("approval-requests-translations").then(function(e){return e.X});case"./translations/locales/he.json":return import("approval-requests-translations").then(function(e){return e.Y});case"./translations/locales/hi.json":return import("approval-requests-translations").then(function(e){return e.Z});case"./translations/locales/hr.json":return import("approval-requests-translations").then(function(e){return e._});case"./translations/locales/hu.json":return import("approval-requests-translations").then(function(e){return e.$});case"./translations/locales/hy.json":return import("approval-requests-translations").then(function(e){return e.a0});case"./translations/locales/id.json":return import("approval-requests-translations").then(function(e){return e.a1});case"./translations/locales/is.json":return import("approval-requests-translations").then(function(e){return e.a2});case"./translations/locales/it-ch.json":return import("approval-requests-translations").then(function(e){return e.a3});case"./translations/locales/it.json":return import("approval-requests-translations").then(function(e){return e.a4});case"./translations/locales/ja.json":return import("approval-requests-translations").then(function(e){return e.a5});case"./translations/locales/ka.json":return import("approval-requests-translations").then(function(e){return e.a6});case"./translations/locales/kk.json":return import("approval-requests-translations").then(function(e){return e.a7});case"./translations/locales/kl-dk.json":return import("approval-requests-translations").then(function(e){return e.a8});case"./translations/locales/km.json":return import("approval-requests-translations").then(function(e){return e.a9});case"./translations/locales/ko.json":return import("approval-requests-translations").then(function(e){return e.aa});case"./translations/locales/ku.json":return import("approval-requests-translations").then(function(e){return e.ab});case"./translations/locales/ky.json":return import("approval-requests-translations").then(function(e){return e.ac});case"./translations/locales/lt.json":return import("approval-requests-translations").then(function(e){return e.ad});case"./translations/locales/lv.json":return import("approval-requests-translations").then(function(e){return e.ae});case"./translations/locales/mk.json":return import("approval-requests-translations").then(function(e){return e.af});case"./translations/locales/mn.json":return import("approval-requests-translations").then(function(e){return e.ag});case"./translations/locales/ms.json":return import("approval-requests-translations").then(function(e){return e.ah});case"./translations/locales/mt.json":return import("approval-requests-translations").then(function(e){return e.ai});case"./translations/locales/my.json":return import("approval-requests-translations").then(function(e){return e.aj});case"./translations/locales/ne.json":return import("approval-requests-translations").then(function(e){return e.ak});case"./translations/locales/nl-be.json":return import("approval-requests-translations").then(function(e){return e.al});case"./translations/locales/nl.json":return import("approval-requests-translations").then(function(e){return e.am});case"./translations/locales/no.json":return import("approval-requests-translations").then(function(e){return e.an});case"./translations/locales/oc-es.json":return import("approval-requests-translations").then(function(e){return e.ao});case"./translations/locales/oc.json":return import("approval-requests-translations").then(function(e){return e.ap});case"./translations/locales/pl.json":return import("approval-requests-translations").then(function(e){return e.aq});case"./translations/locales/pt-br.json":return import("approval-requests-translations").then(function(e){return e.ar});case"./translations/locales/pt.json":return import("approval-requests-translations").then(function(e){return e.as});case"./translations/locales/ro-md.json":return import("approval-requests-translations").then(function(e){return e.at});case"./translations/locales/ro.json":return import("approval-requests-translations").then(function(e){return e.au});case"./translations/locales/ru.json":return import("approval-requests-translations").then(function(e){return e.av});case"./translations/locales/si.json":return import("approval-requests-translations").then(function(e){return e.aw});case"./translations/locales/sk.json":return import("approval-requests-translations").then(function(e){return e.ax});case"./translations/locales/sl.json":return import("approval-requests-translations").then(function(e){return e.ay});case"./translations/locales/sq.json":return import("approval-requests-translations").then(function(e){return e.az});case"./translations/locales/sr-me.json":return import("approval-requests-translations").then(function(e){return e.aA});case"./translations/locales/sr.json":return import("approval-requests-translations").then(function(e){return e.aB});case"./translations/locales/sv.json":return import("approval-requests-translations").then(function(e){return e.aC});case"./translations/locales/sw-ke.json":return import("approval-requests-translations").then(function(e){return e.aD});case"./translations/locales/ta.json":return import("approval-requests-translations").then(function(e){return e.aE});case"./translations/locales/th.json":return import("approval-requests-translations").then(function(e){return e.aF});case"./translations/locales/tr.json":return import("approval-requests-translations").then(function(e){return e.aG});case"./translations/locales/uk.json":return import("approval-requests-translations").then(function(e){return e.aH});case"./translations/locales/ur-pk.json":return import("approval-requests-translations").then(function(e){return e.aI});case"./translations/locales/ur.json":return import("approval-requests-translations").then(function(e){return e.aJ});case"./translations/locales/uz.json":return import("approval-requests-translations").then(function(e){return e.aK});case"./translations/locales/vi.json":return import("approval-requests-translations").then(function(e){return e.aL});case"./translations/locales/zh-cn.json":return import("approval-requests-translations").then(function(e){return e.aM});case"./translations/locales/zh-tw.json":return import("approval-requests-translations").then(function(e){return e.aN});default:return new Promise(function(t,s){("function"==typeof queueMicrotask?queueMicrotask:setTimeout)(s.bind(null,new Error("Unknown variable dynamic import: "+e)))})}}(`./translations/locales/${e}.json`)),k]),x(e,a.jsx(g,{theme:y(t),children:a.jsx(w,{helpCenterPath:n,children:a.jsx(is,{...s,helpCenterPath:n})})}))}export{us as renderApprovalRequest,Ie as renderApprovalRequestList};
