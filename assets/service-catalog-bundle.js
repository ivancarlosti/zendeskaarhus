import{r as e,am as t,aW as n,h as s,M as a,j as r,aX as o,a2 as i,u as l,a1 as c,aY as u,aZ as d,a_ as h,as as m,c as p,d as g,a$ as f,O as j,S as b,aE as v,A as x,aU as y,aP as w,aQ as _,aS as k,aO as $,b0 as C,b1 as S,b2 as q,aw as L,n as E,z as I,B as T,G as A,H as R,J as z,K as F,L as P,g as U,b3 as N,b4 as M,N as O,b5 as H,w as D,k as V,m as B,b6 as G,az as J,t as K,F as W,a as Z,f as X,aV as Y,b7 as Q,b8 as ee}from"shared";import{g as te,a as ne,u as se,A as ae,R as re,t as oe}from"ticket-fields";function ie(e){return t.sanitize(e,{ADD_ATTR:["target"]})}function le(e){if(!e)return"";return(new DOMParser).parseFromString(e,"text/html").body.textContent??""}const ce="attachments",ue="zen:custom_object:standard::itam_asset_type",de="zen:custom_object:standard::itam_asset",he="is-service-catalog-preview",me="preview",pe="true",ge=["true","false"],fe=["pre","strong","b","p","blockquote","ul","ol","li","h2","h3","h4","i","em","br"],je={priority:["priority","basic_priority"],type:["tickettype"]},be=/^\d{4}-\d{2}-\d{2}$/,ve=/^[0-9A-HJKMNP-TV-Z]{26}$/i;function xe(e,t){const n=e.trim();if(""!==n&&!Number.isNaN(Number(n))){const e=Number(n);return t.find(t=>t.id===e)}const s=je[n];if(s)return t.find(e=>s.includes(e.type))}function ye(e,n){const s=t.sanitize(n,{ALLOWED_TAGS:fe});switch(e.type){case"partialcreditcard":{const e=s.replace(/\D/g,"");return e?e.slice(-4):void 0}case"multiselect":return s.split(",").filter(t=>e.options.some(e=>e.value===t));case"checkbox":if(!ge.includes(s))return;return"true"===s;case"date":return function(e){if(!be.test(e))return!1;const t=new Date(e),[n,s,a]=e.split("-").map(Number);return t.getUTCFullYear()===n&&t.getUTCMonth()+1===s&&t.getUTCDate()===a}(s)?s:void 0;case"lookup":if(function(e){return e.relationship_target_type===de||e.relationship_target_type===ue}(e))return;if(!ve.test(s))return;return s;default:return s}}function we(){return e.useMemo(()=>"undefined"==typeof window?new Map:function(e,t=e.length){const n=new Map;if(t>2048)return n;const s=new URLSearchParams(e);for(const[e,t]of s){if(!e.startsWith("tf_"))continue;const s=e.substring(3);0!==s.length&&n.set(s,t)}return n}(window.location.search,window.location.href.length),[])}const _e=e=>"tagger"===e.type?e.custom_field_options.find(e=>e.default)?.value??null:null,ke=["standard::service_catalog_item","standard::service_catalog_category"],$e=async(e,t)=>{const[s,a]=await Promise.all([fetch(`/api/v2/ticket_forms/${e}`),fetch(`/api/v2/ticket_fields?locale=${t}`)]);if(!s.ok)throw new Error("Error fetching form data");if(!a.ok)throw new Error("Error fetching fields data");const r=await s.json(),o=await a.json();if(!r.ticket_form.active)throw new Error("Associated ticket form is not active");const i=r.ticket_form,l=i.ticket_field_ids,c=i.end_user_conditions||[],u=o.ticket_fields;let d=null,h=null;const m=l.map(e=>{const t=u.find(t=>t.id===e);return t&&"subject"!==t.type&&"description"!==t.type&&t.active&&t.editable_in_portal?"lookup"===t.type&&(e=>{const t=ne(e.relationship_target_type);return ke.includes(t)})(t)?("standard::service_catalog_item"===ne(t.relationship_target_type)?d=t:(e=>"standard::service_catalog_category"===ne(e.relationship_target_type))(t)&&(h=t),null):(e=>{const{id:t,type:s,description:a,title_in_portal:r,custom_field_options:o,required_in_portal:i,relationship_target_type:l,relationship_filter:c}=e;return{id:t,type:s,name:`custom_fields_${t}`,description:ie(n(a)),label:r,options:o,required:i,relationship_target_type:l,relationship_filter:c,error:null,value:_e(e)}})(t):null}).filter(Boolean);if(!d)throw new Error("Associated lookup field not found");return{requestFields:m,associatedLookupField:d,categoryLookupField:h,endUserConditions:c}};function Ce(t,n){const[s,a]=e.useState([]),[r,o]=e.useState([]),[i,l]=e.useState(),[c,u]=e.useState(null),[d,h]=e.useState(null),[m,p]=e.useState(!1),[g,f]=e.useState({assetTypeIds:[],assetIds:[],isAssetTypeHidden:!1,assetTypeHiddenValue:"",assetTypeIsRequired:!1,assetIsRequired:!1}),j=t?.custom_object_fields?.["standard::asset_option"],b=t?.custom_object_fields?.["standard::asset_type_option"],{fetchAssets:v,fetchAssetTypes:x}=((t,n)=>({fetchAssets:e.useCallback(async()=>{if(!t)return;const e=await fetch(`/api/v2/custom_objects/standard::service_catalog_asset_option/records/${t}`);if(!e.ok)throw new Error("Error fetching asset data");const n=await e.json();if(!n?.custom_object_record)throw new Error("Missing custom_object_record in asset response");const{name:s,custom_object_fields:a}=n.custom_object_record,r=a??{};return{assetIds:r["standard::asset_filter_ids"],assetDescription:r["standard::description"],assetName:s,isRequired:r["standard::is_required"]}},[t]),fetchAssetTypes:e.useCallback(async()=>{if(!n)return;const e=await fetch(`/api/v2/custom_objects/standard::service_catalog_asset_type_option/records/${n}`);if(!e.ok)throw new Error("Error fetching asset type data");const t=await e.json();if(!t?.custom_object_record)throw new Error("Missing custom_object_record in asset type response");const{name:s,custom_object_fields:a}=t.custom_object_record,r=a??{};return{assetTypeIds:r["standard::asset_type_ids"],isHiddenAssetsType:!!r["standard::is_hidden"],assetTypeDescription:r["standard::description"],assetTypeName:s,isRequired:r["standard::is_required"]}},[n])}))(j??"",b??""),y=we();e.useEffect(()=>{if(!t?.form_id)return;let e=!0;return(async()=>{p(!0),h(null);try{const[s,r,i]=await Promise.all([$e(t.form_id,n),x(),v()]);if(!e)return;const{requestFields:c,associatedLookupField:d,categoryLookupField:h,endUserConditions:m}=s,p=((e,t)=>{let n=[];if(e?.assetTypeIds){const t=e.assetTypeIds;Array.isArray(t)?n=t.map(String):"string"==typeof t&&(n=t.split(",")),n=n.map(e=>e.trim()).filter(Boolean)}let s=[];if(t?.assetIds){const e=t.assetIds;"string"==typeof e?s=e.split(","):Array.isArray(e)&&(s=e.map(String)),s=s.map(e=>e.trim()).filter(Boolean)}const a=!!e?.isHiddenAssetsType;return{assetTypeIds:n,assetIds:s,isAssetTypeHidden:a,assetTypeHiddenValue:a&&n[0]?n[0]:"",assetTypeLabel:e?.assetTypeName,assetTypeDescription:e?.assetTypeDescription,assetTypeIsRequired:e?.isRequired||!1,assetLabel:t?.assetName,assetDescription:t?.assetDescription,assetIsRequired:t?.isRequired||!1}})(r,i);f(p),l(d),u(h),o(m);const g=((e,t)=>e.map(e=>"zen:custom_object:standard::itam_asset_type"===e.relationship_target_type?{...e,label:t.assetTypeLabel||e.label,description:ie(t.assetTypeDescription||e.description),required:t.assetTypeIsRequired||e.required}:"zen:custom_object:standard::itam_asset"===e.relationship_target_type?{...e,label:t.assetLabel||e.label,description:ie(t.assetDescription||e.description),required:t.assetIsRequired||e.required}:e))(c,p),j=function(e,t){if(0===t.size)return e;const n=new Set;let s=e;for(const[e,a]of t){const t=xe(e,s);if(!t||n.has(t.id))continue;const r=ye(t,a);void 0!==r&&(n.add(t.id),s=s.map(e=>e.id===t.id?{...e,value:r}:e))}return s}(g,y);a(j)}catch(t){e&&h(t)}finally{e&&p(!1)}})(),()=>{e=!1}},[n,t?.form_id,v,x,y]);const w=e.useCallback((e,t)=>{const n=s.map(n=>n.name===e.name?{...n,value:t,error:null}:n);a(n)},[s]);return{requestFields:te(s,r),associatedLookupField:i,categoryLookupField:c,error:d,setRequestFields:a,handleChange:w,isRequestFieldsLoading:m,assetTypeHiddenValue:g.assetTypeHiddenValue,isAssetTypeHidden:g.isAssetTypeHidden,assetTypeIds:g.assetTypeIds,assetIds:g.assetIds}}const Se=a(i)`
  background-color: ${({theme:e})=>s({theme:e,hue:"grey",shade:100})};
  width: ${e=>"large"===e.size?72:40}px !important;
  height: ${e=>"large"===e.size?72:40}px !important;

  && > svg {
    width: ${e=>"large"===e.size?28:16}px;
    height: ${e=>"large"===e.size?28:16}px;
    color: ${({theme:e})=>s({theme:e,hue:"grey",shade:600})};
  }
`,qe=({size:e,url:t})=>r.jsx(Se,{size:e,isSystem:!0,children:t?r.jsx("img",{src:t,alt:""}):r.jsx(o,{"aria-hidden":"true"})}),Le=a.div`
  border-bottom: ${e=>e.theme.borders.sm}
    ${({theme:e})=>s({theme:e,hue:"grey",shade:300})};
  padding-bottom: ${e=>e.theme.space.lg};
  margin-inline-end: ${e=>e.theme.space.xl};

  @media (max-width: ${e=>e.theme.breakpoints.md}) {
    margin-inline-end: 0;
  }
`,Ee=a(h)`
  font-weight: ${e=>e.theme.fontWeights.semibold};
  margin-bottom: 0;
  overflow-wrap: break-word;
  max-width: 100%;
`,Ie=a.div`
  font-size: ${e=>e.theme.fontSizes.md};
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${e=>e.$isCollapsed?3:"none"};
  overflow: hidden;
  margin-top: ${e=>e.theme.space.md};
  padding-inline-end: ${e=>e.theme.space.xl};
  overflow-wrap: break-word;

  @media (max-width: ${e=>e.theme.breakpoints.md}) {
    padding-inline-end: 0;
  }
`,Te=a(c)`
  margin-top: ${e=>e.theme.space.sm};
  font-size: ${e=>e.theme.fontSizes.md};
  &:hover {
    text-decoration: none;
  }
`,Ae=a.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${e=>e.theme.space.md};
`,Re=({title:n,description:s,thumbnailUrl:a})=>{const[o,i]=e.useState(!0),[h,m]=e.useState(!1),{t:p}=l(),g=e.useRef(null),f=e.useMemo(()=>{return e=s??"",t.sanitize(e,{ADD_TAGS:["iframe"],ADD_ATTR:["allow","allowfullscreen","frameborder","scrolling","target","title"]});var e},[s]);e.useEffect(()=>{const e=g.current;if(e){requestAnimationFrame(()=>{const t=e.getBoundingClientRect().height,n=e.scrollHeight-t>1;m(n),n||i(!1)})}},[f]);return r.jsxs(Le,{children:[r.jsxs(Ae,{children:[r.jsx(qe,{size:"large",url:a}),r.jsx(Ee,{tag:"h1",children:n})]}),f&&r.jsx(Ie,{ref:g,className:"service-catalog-description",$isCollapsed:o,dangerouslySetInnerHTML:{__html:f}}),h&&r.jsxs(Te,{isLink:!0,onClick:()=>{i(!o)},children:[o?p("service-catalog.item.read-more","Read more"):p("service-catalog.item.read-less","Read less"),r.jsx(c.EndIcon,{children:o?r.jsx(d,{}):r.jsx(u,{})})]})]})},ze=a(m.Header)`
  color: ${({theme:e})=>s({theme:e,hue:"successHue",shade:700})};
`,Fe=a.div`
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.space.md};
`,Pe=a(m.Body)`
  padding-bottom: 48px;
`,Ue=a(j)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${e=>e.theme.space.sm};
`,Ne=a.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${e=>e.theme.space.sm};
`,Me=a.div`
  display: flex;
  gap: ${e=>e.theme.space.xs};
`,Oe=a.div`
  display: flex;
  flex-direction: column;
`,He=a(m.Footer)`
  padding: 32px 40px;
  border-top: 1px solid rgb(232, 234, 236);
`,De=({onCancel:t,onCreate:n,selectedUser:s,setSelectedUser:a})=>{const{t:o}=l(),[i,u]=e.useState(!1),d=e.useRef(null),[h,v]=e.useState(s),[x,y]=e.useState(s?.name??""),[w,_]=e.useState(!1),k=e.useRef(!1),{options:$,isLoadingOptions:C,searchUsers:S,clearOptions:q}=se(h,()=>{k.current=!1}),L=(e,t)=>{if(!t.trim())return e;const n=e.toLowerCase().indexOf(t.toLowerCase());if(-1===n)return e;const s=e.slice(0,n),a=e.slice(n,n+t.length),o=e.slice(n+t.length);return r.jsxs(r.Fragment,{children:[s,r.jsx("strong",{children:a}),o]})},E={id:"loading",name:o("service-catalog.change-user-modal.loading-users","Loading users..."),email:""},I={id:"no-results",name:o("service-catalog.change-user-modal.no-matches-found","Type to search"),email:""},T=e.useCallback(({type:e,inputValue:t,selectionValue:n})=>{if(void 0!==n){const e=$.find(e=>e.id===n);e&&"loading"!==e.id&&"no-results"!==e.id&&(v(e),y(e.name),u(!1),k.current=!1)}"input:change"===e&&void 0!==t&&(y(t),k.current=!0,t.trim().length>=3?S(t.trim()):(q(),v(null),k.current=!1))},[$,S,q]),A=e.useCallback(()=>{if(!x.trim())return void(h&&(v(null),u(!1)));if(h&&(h.name.toLowerCase()===x.toLowerCase()||h.email.toLowerCase()===x.toLowerCase()))return;const e=$.find(e=>e.name.toLowerCase()===x.toLowerCase());e&&(v(e),y(e.name),u(!1))},[x,$,h]),R=e.useCallback(()=>{k.current||A()},[A]),z=e.useCallback(e=>{"Enter"!==e.key||k.current||C||A()},[C,A]),F=C?[E]:0===$.length?[I]:$;return r.jsxs(r.Fragment,{children:[r.jsx(ze,{tag:"h2",children:o("service-catalog.change-user-modal.requester-title","Change requester")}),r.jsx(Pe,{children:r.jsx(Fe,{children:r.jsx(r.Fragment,{children:r.jsxs(p,{children:[r.jsx(p.Label,{children:o("service-catalog.change-user-modal.select-requester-label","Select requester* (required)")}),r.jsx(g,{ref:d,inputValue:x,selectionValue:h?.id,onChange:T,validation:i?"error":void 0,"data-test-id":"user-autocomplete-input",isAutocomplete:!0,placeholder:o("service-catalog.change-user-modal.requester-search-placeholder","Search requesters..."),renderValue:()=>h?.name||"",inputProps:{onBlur:R,onKeyDown:z},children:F.length>0?F.map(e=>r.jsx(Ue,{value:e.id,label:e.name,isDisabled:"loading"===e.id||"no-results"===e.id,children:e.email?r.jsxs(Me,{children:[r.jsx(f,{}),r.jsxs(Oe,{children:[r.jsx("span",{children:L(e.name,x)}),r.jsx(j.Meta,{children:r.jsx(b,{hue:"grey",children:e.email})})]})]}):r.jsx(Ne,{children:r.jsx("span",{children:e.name})})},e.id)):null}),i&&r.jsx(p.Message,{validation:"error",validationLabel:o("service-catalog.validation.error.aria.label","Error"),children:o("service-catalog.change-user-modal.requester-required","Select a requester")})]})})})}),r.jsxs(He,{children:[r.jsx(m.FooterItem,{children:r.jsx(c,{onClick:t,isBasic:!0,"data-test-id":"cancel-button",children:o("service-catalog.change-user-modal.cancel","Cancel")})}),r.jsx(m.FooterItem,{children:r.jsx(c,{isPrimary:!0,onClick:async()=>{if(h){_(!0);try{await n(h.name,h.id),a(h)}catch(e){console.error("Error changing user:",e)}finally{_(!1)}}else u(!0)},disabled:w||!h,"data-test-id":"change-user-button",children:o("service-catalog.change-user-modal.change-user","Save")})})]})]})},Ve=({onClose:e,onCreate:t,selectedUser:n,setSelectedUser:s})=>{const{t:a}=l();return r.jsxs(m,{onClose:e,focusOnMount:!1,children:[r.jsx(De,{onCancel:e,onCreate:async(e,n)=>{await t(e,n)},selectedUser:n,setSelectedUser:s}),r.jsx(v,{"aria-label":a("service-catalog.change-user-modal.close","Close dialog")})]})},Be=a.form`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: ${e=>e.theme.space.md};

  @media (max-width: ${e=>e.theme.breakpoints.md}) {
    flex-direction: column;
  }
`,Ge=a.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.space.md};
  margin-inline-end: ${e=>e.theme.space.xl};

  @media (max-width: ${e=>e.theme.breakpoints.md}) {
    margin-inline-end: 0;
  }
`,Je=a.div`
  flex: 1;
  padding: ${e=>e.theme.space.lg};
  border: ${e=>e.theme.borders.sm}
    ${({theme:e})=>s({theme:e,hue:"grey",shade:300})};
  height: fit-content;
  max-width: 360px;

  @media (max-width: ${e=>e.theme.breakpoints.md}) {
    position: sticky;
    top: 0;
    background: ${({theme:e})=>s({theme:e,variable:"background.default"})};
    padding: ${e=>e.theme.space.lg};
    border: none;
    border-top: ${e=>e.theme.borders.sm}
      ${({theme:e})=>s({theme:e,hue:"grey",shade:300})};
    width: 100vw;
    margin-inline-start: 0;
  }
`,Ke=a.div`
  flex: 1;
  margin-inline-start: ${e=>e.theme.space.xl};

  @media (max-width: ${e=>e.theme.breakpoints.md}) {
    position: sticky;
    bottom: 0;
    margin-inline-start: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`,We=a.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.space.lg};
  margin-inline-end: ${e=>e.theme.space.xl};
  min-width: 0;

  @media (max-width: ${e=>e.theme.breakpoints.md}) {
    margin-inline-end: 0;
  }
`,Ze=a(y)`
  width: 100%;
  height: 48px;
  display: block;
`,Xe=a.div`
  margin-bottom: 16px;
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: ${e=>e.theme.space.xxs};
`,Ye=a.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`,Qe=a.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,et=e=>e.relationship_target_type===de,tt=e=>e.relationship_target_type===ue;function nt({requestFields:t,serviceCatalogItem:n,baseLocale:s,hasAtMentions:a,userRole:o,requesterId:i,requestOnBehalfEnabled:u,userName:d,selectedUser:h,setSelectedUser:m,brandId:p,defaultOrganizationId:g,handleChange:f,onSubmit:v,attachmentsOption:y,attachmentsRequiredError:w,setAttachmentsRequiredError:_,isRequestFieldsLoading:k,isLoadingAttachmentsOption:$,assetTypeError:C,assetError:S,assetTypeHiddenValue:q,isAssetTypeHidden:L,assetTypeIds:E,assetIds:I,onAttachmentUploadingChange:T,isFormInitializing:A,isPreviewMode:R=!1}){const{t:z}=l(),[F,P]=e.useState(!1),[U,N]=e.useState(d),M=()=>{P(!1)},O=async(e,t)=>{if(!Array.isArray(e)||0===e.length)return[];const n=e.map(e=>{const t={name:e.name,value:e.id,serialNumber:e.custom_object_fields["standard::serial_number"]};if("standard::itam_asset"===e.custom_object_key){const n=e.custom_object_fields??{};return{...t,item_asset_type_id:n["standard::asset_type"]??""}}return{...t,item_asset_type_id:""}});if(tt(t))return L?[]:E?.length?n.filter(e=>E.includes(e.value)):[];if(et(t)){let e=n;return I?.length&&(e=e.filter(e=>I.includes(e.item_asset_type_id??""))),e}return n.map(({name:e,value:t,serialNumber:n})=>({name:e,value:t,serialNumber:n}))},H=e=>e.serialNumber?r.jsxs(r.Fragment,{children:[e.name,r.jsx(j.Meta,{children:r.jsx(b,{hue:"grey",children:z("service-catalog.item.serial-number-label","SN: {{serialNumber}}",{serialNumber:e.serialNumber})})})]}):e.name,D=e.useCallback(e=>{_(null),T(e)},[_,T]);return r.jsxs(r.Fragment,{children:[r.jsxs(Be,{onSubmit:v,noValidate:!0,children:[r.jsxs(We,{children:[r.jsx(Re,{title:n.name,description:n.description,thumbnailUrl:n.thumbnail_url}),r.jsx(Ge,{children:(()=>{if(k||$)return null;const n=y?.custom_object_fields?.["standard::position_in_portal"]??t.length,l=y?r.jsx(ae,{field:{name:ce,label:z("service-catalog.item.attachments-label","Upload a file"),description:y.custom_object_fields["standard::description"]??"",error:w,attachments:[],isRequired:y.custom_object_fields["standard::is_required"]??!1},baseLocale:s,onUploadingChange:D},"attachments"):null,c=[];return t.forEach((u,d)=>{if(l&&"number"==typeof n&&d===n&&c.push(l),tt(u)&&L)return void c.push(r.jsxs(e.Fragment,{children:[r.jsx("input",{type:"hidden",name:u.name,value:q}),r.jsx("input",{type:"hidden",name:"isAssetTypeHidden",value:"true"})]},u.id));const h={...u,error:et(u)?S||u.error:tt(u)&&C||u.error};c.push(r.jsx(re,{field:h,baseLocale:s,hasAtMentions:a,userRole:o,userId:i,brandId:p,defaultOrganizationId:g,handleChange:f,visibleFields:t,buildLookupFieldOptions:O,renderLookupFieldOption:H},u.id))}),l&&"number"==typeof n&&n>=t.length&&c.push(l),c})()})]}),r.jsx(Ke,{children:r.jsxs(Je,{children:[r.jsxs(Ye,{children:[r.jsxs(Xe,{children:[r.jsx(b,{isBold:!0,children:z("service-catalog.item.requester","Requester")}),r.jsx(Qe,{children:U})]}),u&&r.jsx(r.Fragment,{children:r.jsx(x,{isUnderlined:!1,onClick:()=>{P(!0)},children:z("service-catalog.item.change-user-requesting-on-behalf","Change")})})]}),A?r.jsx(Ze,{}):r.jsx(c,{isPrimary:!0,size:"large",isStretched:!0,type:"submit",disabled:R,title:R?z("service-catalog.item.preview-mode.submit-disabled-tooltip","Submitting requests is disabled while previewing a draft"):void 0,children:z("service-catalog.item.submit-button","Submit request")})]})})]}),F&&r.jsx(Ve,{onClose:M,onCreate:async e=>{N(e),M()},setSelectedUser:m,selectedUser:h})]})}const st=a($)`
  max-width: min(420px, calc(100vw - 32px));

  [data-garden-id="dropdowns.menu.item.content"] {
    min-width: 0;
    flex: 1 1 auto;
    overflow: hidden;
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow-wrap: anywhere;
  }
`,at=a(_)`
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
`;function rt({categories:e,selectedCategoryId:t,onCategoryChange:n}){const{t:s}=l();return e.length<2?null:r.jsx(st,{button:e=>r.jsxs(c,{...e,isBasic:!0,children:[s("service-catalog.item.change-category","Change category"),r.jsx(c.EndIcon,{children:r.jsx(k,{})})]}),onChange:({value:e})=>{e&&n(e)},children:r.jsx(w,{type:"radio",children:e.map(e=>r.jsxs(at,{value:e.id,isSelected:e.id===t,children:[e.name,e.path?.length>0&&r.jsx(_.Meta,{children:e.path.join(" > ")})]},e.id))})})}const ot=a(C)`
  background: ${({theme:e})=>s({theme:e,hue:"blue",shade:200})};
  border-bottom: 1px solid
    ${({theme:e})=>s({theme:e,hue:"blue",shade:300})};
  color: ${({theme:e})=>s({theme:e,hue:"blue",shade:700})};
  box-shadow: none;

  svg {
    color: ${({theme:e})=>s({theme:e,hue:"blue",shade:600})};
  }
`,it=a(C.Title)`
  color: ${({theme:e})=>s({theme:e,hue:"blue",shade:800})};
`;function lt(){const{t:t}=l(),[n,s]=e.useState(null),a=e.useRef("");return e.useEffect(()=>{const e=document.createElement("div");return e.setAttribute("data-preview-mode-banner-host","true"),e.style.position="fixed",e.style.top="0",e.style.left="0",e.style.right="0",e.style.zIndex=String(S),a.current=document.body.style.paddingTop,document.body.prepend(e),s(e),()=>{e.remove(),document.body.style.paddingTop=a.current,s(null)}},[]),e.useEffect(()=>{if(!n)return;let e="",t=null;const s=()=>{t=null;const s=`${n.offsetHeight}px`;s!==e&&(document.body.style.paddingTop=s,e=s)},r=()=>{null===t&&(t=window.requestAnimationFrame(s))};let o;return s(),"undefined"!=typeof ResizeObserver&&(o=new ResizeObserver(r),o.observe(n)),window.addEventListener("resize",r),()=>{null!==t&&window.cancelAnimationFrame(t),o?.disconnect(),window.removeEventListener("resize",r),document.body.style.paddingTop=a.current}},[n]),n?q.createPortal(r.jsx("div",{"data-testid":"preview-mode-banner",children:r.jsx(ot,{type:"info",children:r.jsxs(C.Content,{children:[r.jsx(it,{children:t("service-catalog.item.preview-mode.title","Preview mode")}),t("service-catalog.item.preview-mode.message","If you navigate away from this page or click on anything outside of this preview, you'll exit the preview mode.")]})})}),n):null}const ct=(e,t,n)=>{const s=document.createElement("a");if(s.setAttribute("href",`${window.location.origin}${t}/services/${e.id}`),s.setAttribute("style","text-decoration: underline"),s.setAttribute("target","_blank"),s.setAttribute("rel","noopener noreferrer"),s.textContent=e.name,!n)return s.outerHTML;const a=document.createElement("p");a.setAttribute("style","margin:0;padding:0"),a.textContent=n.submitterLabel;const r=document.createElement("p");return r.setAttribute("style","margin:0;padding:0"),r.textContent=n.requesterLabel,`${s.outerHTML}${a.outerHTML}${r.outerHTML}`};async function ut(e,t,n,s,a,r,o,i,l){try{const c=await(async()=>{try{const e=await fetch("/api/v2/users/me.json");if(!e.ok)throw new Error("Error fetching current user data");return await e.json()}catch(e){throw new Error("Error fetching current user data")}})(),u=s.map(e=>e.id),d=t.map(e=>({id:e.id,value:e.value})),h=[{id:n.id,value:e.id}];r&&o&&h.push({id:r.id,value:o});const m=c.user.id,p=null!=i&&i!==m;return await fetch("/hc/api/v2/service_catalog/requests",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-Token":c.user.authenticity_token},body:JSON.stringify({request:{item_id:e.id,subject:`${e.name}`,comment:{html_body:ct(e,a,l),uploads:u},custom_fields:[...d,...h],...p?{requester_id:i,collaborators:[m]}:{}}})})}catch(e){return void console.error("Error submitting service request:",e)}}function dt(e){return e.relationship_target_type===ue}function ht(e){return e.relationship_target_type===de}function mt(e){const{value:t}=e;return Array.isArray(t)?t.length>0:null!=t&&""!==t}const pt=a.div`
  display: flex;
  flex-direction: column;
`,gt=a(x)`
  text-decoration: underline;
  display: block;
  margin-top: ${e=>e.theme.space.xxs}px;
`,ft=e=>e.relationship_target_type===ue;function jt({serviceCatalogItemId:t,baseLocale:n,hasAtMentions:s,userRole:a,organizations:o,userId:i,brandId:c,userName:u,helpCenterPath:d}){const{serviceCatalogItem:h,errorFetchingItem:m}=function(t){const[n,s]=e.useState(),[a,r]=e.useState(null);return e.useEffect(()=>{(async()=>{try{const e=await fetch(`/api/v2/help_center/service_catalog/items/${t}`);if(!e.ok)throw new Error("Error fetching service catalog item");{const t=await e.json();s(t.service_catalog_item)}}catch(e){r(e)}})()},[t]),{serviceCatalogItem:n,errorFetchingItem:a}}(t),{requestFields:p,associatedLookupField:g,categoryLookupField:f,error:j,setRequestFields:b,handleChange:v,isRequestFieldsLoading:x,assetTypeHiddenValue:y,isAssetTypeHidden:w,assetTypeIds:_,assetIds:k}=Ce(h,n),{t:$}=l(),[C,S]=e.useState(null),[I,T]=e.useState(null);e.useEffect(()=>{if(!h?.categories?.length)return;const e=new URLSearchParams(window.location.search).get("category_id"),t=h.categories.find(t=>t.id===e);S(t?t.id:h.categories[0]?.id??null)},[h]);const A=e.useCallback(e=>{S(e);const t=new URLSearchParams(window.location.search);t.set("category_id",e),window.history.replaceState({},"",`${window.location.pathname}?${t.toString()}`)},[]),R=h?.custom_object_fields?.["standard::attachment_option"],z=h?.is_request_on_behalf,F=I?Number(I.id):i,{attachmentsOption:P,errorAttachmentsOption:U,isLoadingAttachmentsOption:N}=function(t){const[n,s]=e.useState(),[a,r]=e.useState(!1),[o,i]=e.useState(null);return e.useEffect(()=>{if(!t)return s(void 0),i(null),void r(!1);(async()=>{i(null),r(!1);try{const e=await fetch(`/api/v2/custom_objects/standard::service_catalog_attachment_option/records/${t}`);if(!e.ok)throw new Error("Error fetching service catalog item");{const t=await e.json();s(t.custom_object_record)}}catch(e){i(e)}finally{r(!1)}})()},[t]),{attachmentsOption:n,errorAttachmentsOption:o,isLoadingAttachmentsOption:a}}(R),{validate:M}=function(t){const{t:n}=l();return{validate:e.useCallback((e,s)=>{const a={attachments:null,assetType:null,asset:null,fields:{}};t&&t.custom_object_fields["standard::is_required"]&&0===s.length&&(a.attachments=n("service-catalog.attachments-required-error","Upload a file to continue."));for(const t of e)t.required&&!mt(t)&&(dt(t)?a.assetType=n("service-catalog.asset-type-required-error","Select an asset type"):ht(t)?a.asset=n("service-catalog.asset-required-error","Select an asset"):a.fields[t.id]=n("service-catalog.field-required-error","This field is required"));return{hasError:Boolean(a.attachments||a.assetType||a.asset||Object.keys(a.fields).length>0),errors:a}},[t,n])}}(P),[O,H]=e.useState(null),[D,V]=e.useState(null),[B,G]=e.useState(null),[J,K]=e.useState(!1),[W,Z]=e.useState(!1);e.useEffect(()=>{const e=e=>{e.persisted&&K(!1)};return window.addEventListener("pageshow",e),()=>window.removeEventListener("pageshow",e)},[]);const X=!h||x||N||!(!((h?.categories?.length??0)>0)||!!C),Y="undefined"!=typeof window&&new URLSearchParams(window.location.search).get(me)===pe,Q=h?null===h.published_at:Y;e.useEffect(()=>{if("undefined"!=typeof document&&Q)return document.documentElement.classList.add(he),()=>{document.documentElement.classList.remove(he)}},[Q]),e.useEffect(()=>{if("undefined"==typeof window||!h)return;const e=new URL(window.location.href),t=null===h.published_at,n=e.searchParams.get(me)===pe;t&&!n?(e.searchParams.set(me,pe),window.history.replaceState(null,"",e.toString())):!t&&n&&(e.searchParams.delete(me),window.history.replaceState(null,"",e.toString()))},[h]);const ee=!(Q||X||J||W||!h||!g);if(j)throw j;if(m)throw m;if(U)throw U;function te(e){E({type:"error",title:$("service-catalog.item.service-request-error-title","Service couldn't be submitted"),message:e??$("service-catalog.item.service-request-error-message","Give it a moment and try it again")})}async function ne(e){if(422===e?.status)try{await async function(e){const t=await e.json(),n=t?.details?.base??[];n.filter(e=>null!=e.field_id&&!p.some(t=>t.id===e.field_id)).length>0?te(r.jsxs(r.Fragment,{children:[$("service-catalog.item.service-request-refresh-message","Refresh the page and try again in a few seconds.")," ",r.jsx(gt,{href:`${d}/services/${h.id}`,children:$("service-catalog.item.service-request-refresh-link-text","Refresh the page")})]})):n.length>0&&te($("service-catalog.item.service-request-form-errors-message","Check the form for errors and try again.")),b(e=>e.map(e=>{const t=n.find(t=>t.field_id===e.id);return{...e,error:t?.description||null}}))}(e)}catch{te()}else te()}const se=o.length>0&&o[0]?.id?o[0]?.id?.toString():null,[ae,re]=e.useState(null);return e.useEffect(()=>{re(document.getElementById("category-selector"))},[]),r.jsxs(pt,{children:[Q&&r.jsx(lt,{}),ae&&h&&C&&h.categories.length>0&&q.createPortal(r.jsx(rt,{categories:h.categories,selectedCategoryId:C,onCategoryChange:A}),ae),h&&r.jsx(nt,{requestFields:p,isRequestFieldsLoading:x,isLoadingAttachmentsOption:N,serviceCatalogItem:h,baseLocale:n,hasAtMentions:s,userRole:a,requesterId:F,requestOnBehalfEnabled:z,userName:u,selectedUser:I,setSelectedUser:T,brandId:c,defaultOrganizationId:se,handleChange:(e,t)=>{ft(e)&&t?V(null):(e=>e.relationship_target_type===de)(e)&&t&&G(null),v(e,t)},onSubmit:async e=>{if(e.preventDefault(),Q)return;if(!ee)return void te();const t=e.currentTarget,n=new FormData(t),s="true"===n.get("isAssetTypeHidden"),a=function(e){return e.getAll(ce).filter(e=>"string"==typeof e).map(e=>JSON.parse(e))}(n),r=p.map(e=>ft(e)&&s?{...e,value:n.get(e.name)}:e);if(!function(e,t){const{hasError:n,errors:s}=M(e,t);return H(s.attachments),V(s.assetType),G(s.asset),b(e=>e.map(e=>({...e,error:s.fields[e.id]??null}))),n}(r,a)&&h&&g){K(!0);try{const e=null!=I&&Number(I.id)!==i,t=e?Number(I.id):null,n=e&&I?{submitterLabel:$("service-catalog.item.submitter-label","Submitter: {{name}}",{name:u}),requesterLabel:$("service-catalog.item.requester-label","Requester: {{name}}",{name:I.name})}:null,s=await ut(h,r,g,a,d,f,C,t,n);if(s?.ok){L({type:"success",message:$("service-catalog.item.service-request-submitted","Service request submitted")});const e=await s.json();return void(window.location.href=`${d}/requests/${e.request.id}`)}await ne(s)}catch{}K(!1)}},attachmentsOption:P,attachmentsRequiredError:O,setAttachmentsRequiredError:H,assetTypeError:D,assetError:B,assetTypeHiddenValue:y,isAssetTypeHidden:w,assetTypeIds:_,assetIds:k,onAttachmentUploadingChange:Z,isFormInitializing:X,isPreviewMode:Q})]})}async function bt(e,t,n){const{baseLocale:s,locale:a,helpCenterPath:o}=n;I(s),await T(a,s,[U("service-catalog",e=>function(e){switch(e){case"./translations/locales/af.json":return import("service-catalog-translations").then(function(e){return e.a});case"./translations/locales/ar-x-pseudo.json":return import("service-catalog-translations").then(function(e){return e.b});case"./translations/locales/ar.json":return import("service-catalog-translations").then(function(e){return e.c});case"./translations/locales/az.json":return import("service-catalog-translations").then(function(e){return e.d});case"./translations/locales/be.json":return import("service-catalog-translations").then(function(e){return e.e});case"./translations/locales/bg.json":return import("service-catalog-translations").then(function(e){return e.f});case"./translations/locales/bn.json":return import("service-catalog-translations").then(function(e){return e.g});case"./translations/locales/bs.json":return import("service-catalog-translations").then(function(e){return e.h});case"./translations/locales/ca.json":return import("service-catalog-translations").then(function(e){return e.i});case"./translations/locales/cs.json":return import("service-catalog-translations").then(function(e){return e.j});case"./translations/locales/cy.json":return import("service-catalog-translations").then(function(e){return e.k});case"./translations/locales/da.json":return import("service-catalog-translations").then(function(e){return e.l});case"./translations/locales/de-de.json":return import("service-catalog-translations").then(function(e){return e.m});case"./translations/locales/de-x-informal.json":return import("service-catalog-translations").then(function(e){return e.n});case"./translations/locales/de.json":return import("service-catalog-translations").then(function(e){return e.o});case"./translations/locales/el.json":return import("service-catalog-translations").then(function(e){return e.p});case"./translations/locales/en-001.json":return import("service-catalog-translations").then(function(e){return e.q});case"./translations/locales/en-150.json":return import("service-catalog-translations").then(function(e){return e.r});case"./translations/locales/en-au.json":return import("service-catalog-translations").then(function(e){return e.s});case"./translations/locales/en-ca.json":return import("service-catalog-translations").then(function(e){return e.t});case"./translations/locales/en-gb.json":return import("service-catalog-translations").then(function(e){return e.u});case"./translations/locales/en-my.json":return import("service-catalog-translations").then(function(e){return e.v});case"./translations/locales/en-ph.json":return import("service-catalog-translations").then(function(e){return e.w});case"./translations/locales/en-se.json":return import("service-catalog-translations").then(function(e){return e.x});case"./translations/locales/en-us.json":return import("service-catalog-translations").then(function(e){return e.y});case"./translations/locales/en-x-dev.json":return import("service-catalog-translations").then(function(e){return e.z});case"./translations/locales/en-x-keys.json":return import("service-catalog-translations").then(function(e){return e.A});case"./translations/locales/en-x-obsolete.json":return import("service-catalog-translations").then(function(e){return e.B});case"./translations/locales/en-x-pseudo.json":return import("service-catalog-translations").then(function(e){return e.C});case"./translations/locales/en-x-test.json":return import("service-catalog-translations").then(function(e){return e.D});case"./translations/locales/es-419.json":return import("service-catalog-translations").then(function(e){return e.E});case"./translations/locales/es-ar.json":return import("service-catalog-translations").then(function(e){return e.F});case"./translations/locales/es-cl.json":return import("service-catalog-translations").then(function(e){return e.G});case"./translations/locales/es-es.json":return import("service-catalog-translations").then(function(e){return e.H});case"./translations/locales/es-mx.json":return import("service-catalog-translations").then(function(e){return e.I});case"./translations/locales/es-pe.json":return import("service-catalog-translations").then(function(e){return e.J});case"./translations/locales/es.json":return import("service-catalog-translations").then(function(e){return e.K});case"./translations/locales/et.json":return import("service-catalog-translations").then(function(e){return e.L});case"./translations/locales/eu.json":return import("service-catalog-translations").then(function(e){return e.M});case"./translations/locales/fa-af.json":return import("service-catalog-translations").then(function(e){return e.N});case"./translations/locales/fa.json":return import("service-catalog-translations").then(function(e){return e.O});case"./translations/locales/fi.json":return import("service-catalog-translations").then(function(e){return e.P});case"./translations/locales/fil.json":return import("service-catalog-translations").then(function(e){return e.Q});case"./translations/locales/fo.json":return import("service-catalog-translations").then(function(e){return e.R});case"./translations/locales/fr-ca.json":return import("service-catalog-translations").then(function(e){return e.S});case"./translations/locales/fr-dz.json":return import("service-catalog-translations").then(function(e){return e.T});case"./translations/locales/fr-mu.json":return import("service-catalog-translations").then(function(e){return e.U});case"./translations/locales/fr.json":return import("service-catalog-translations").then(function(e){return e.V});case"./translations/locales/ga.json":return import("service-catalog-translations").then(function(e){return e.W});case"./translations/locales/gl.json":return import("service-catalog-translations").then(function(e){return e.X});case"./translations/locales/he.json":return import("service-catalog-translations").then(function(e){return e.Y});case"./translations/locales/hi.json":return import("service-catalog-translations").then(function(e){return e.Z});case"./translations/locales/hr.json":return import("service-catalog-translations").then(function(e){return e._});case"./translations/locales/hu.json":return import("service-catalog-translations").then(function(e){return e.$});case"./translations/locales/hy.json":return import("service-catalog-translations").then(function(e){return e.a0});case"./translations/locales/id.json":return import("service-catalog-translations").then(function(e){return e.a1});case"./translations/locales/is.json":return import("service-catalog-translations").then(function(e){return e.a2});case"./translations/locales/it-ch.json":return import("service-catalog-translations").then(function(e){return e.a3});case"./translations/locales/it.json":return import("service-catalog-translations").then(function(e){return e.a4});case"./translations/locales/ja.json":return import("service-catalog-translations").then(function(e){return e.a5});case"./translations/locales/ka.json":return import("service-catalog-translations").then(function(e){return e.a6});case"./translations/locales/kk.json":return import("service-catalog-translations").then(function(e){return e.a7});case"./translations/locales/kl-dk.json":return import("service-catalog-translations").then(function(e){return e.a8});case"./translations/locales/km.json":return import("service-catalog-translations").then(function(e){return e.a9});case"./translations/locales/ko.json":return import("service-catalog-translations").then(function(e){return e.aa});case"./translations/locales/ku.json":return import("service-catalog-translations").then(function(e){return e.ab});case"./translations/locales/ky.json":return import("service-catalog-translations").then(function(e){return e.ac});case"./translations/locales/lt.json":return import("service-catalog-translations").then(function(e){return e.ad});case"./translations/locales/lv.json":return import("service-catalog-translations").then(function(e){return e.ae});case"./translations/locales/mk.json":return import("service-catalog-translations").then(function(e){return e.af});case"./translations/locales/mn.json":return import("service-catalog-translations").then(function(e){return e.ag});case"./translations/locales/ms.json":return import("service-catalog-translations").then(function(e){return e.ah});case"./translations/locales/mt.json":return import("service-catalog-translations").then(function(e){return e.ai});case"./translations/locales/my.json":return import("service-catalog-translations").then(function(e){return e.aj});case"./translations/locales/ne.json":return import("service-catalog-translations").then(function(e){return e.ak});case"./translations/locales/nl-be.json":return import("service-catalog-translations").then(function(e){return e.al});case"./translations/locales/nl.json":return import("service-catalog-translations").then(function(e){return e.am});case"./translations/locales/no.json":return import("service-catalog-translations").then(function(e){return e.an});case"./translations/locales/oc-es.json":return import("service-catalog-translations").then(function(e){return e.ao});case"./translations/locales/oc.json":return import("service-catalog-translations").then(function(e){return e.ap});case"./translations/locales/pl.json":return import("service-catalog-translations").then(function(e){return e.aq});case"./translations/locales/pt-br.json":return import("service-catalog-translations").then(function(e){return e.ar});case"./translations/locales/pt.json":return import("service-catalog-translations").then(function(e){return e.as});case"./translations/locales/ro-md.json":return import("service-catalog-translations").then(function(e){return e.at});case"./translations/locales/ro.json":return import("service-catalog-translations").then(function(e){return e.au});case"./translations/locales/ru.json":return import("service-catalog-translations").then(function(e){return e.av});case"./translations/locales/si.json":return import("service-catalog-translations").then(function(e){return e.aw});case"./translations/locales/sk.json":return import("service-catalog-translations").then(function(e){return e.ax});case"./translations/locales/sl.json":return import("service-catalog-translations").then(function(e){return e.ay});case"./translations/locales/sq.json":return import("service-catalog-translations").then(function(e){return e.az});case"./translations/locales/sr-me.json":return import("service-catalog-translations").then(function(e){return e.aA});case"./translations/locales/sr.json":return import("service-catalog-translations").then(function(e){return e.aB});case"./translations/locales/sv.json":return import("service-catalog-translations").then(function(e){return e.aC});case"./translations/locales/sw-ke.json":return import("service-catalog-translations").then(function(e){return e.aD});case"./translations/locales/ta.json":return import("service-catalog-translations").then(function(e){return e.aE});case"./translations/locales/th.json":return import("service-catalog-translations").then(function(e){return e.aF});case"./translations/locales/tr.json":return import("service-catalog-translations").then(function(e){return e.aG});case"./translations/locales/uk.json":return import("service-catalog-translations").then(function(e){return e.aH});case"./translations/locales/ur-pk.json":return import("service-catalog-translations").then(function(e){return e.aI});case"./translations/locales/ur.json":return import("service-catalog-translations").then(function(e){return e.aJ});case"./translations/locales/uz.json":return import("service-catalog-translations").then(function(e){return e.aK});case"./translations/locales/vi.json":return import("service-catalog-translations").then(function(e){return e.aL});case"./translations/locales/zh-cn.json":return import("service-catalog-translations").then(function(e){return e.aM});case"./translations/locales/zh-tw.json":return import("service-catalog-translations").then(function(e){return e.aN});default:return new Promise(function(t,n){("function"==typeof queueMicrotask?queueMicrotask:setTimeout)(n.bind(null,new Error("Unknown variable dynamic import: "+e)))})}}(`./translations/locales/${e}.json`)),oe,P]),A(e,r.jsx(R,{theme:F(t),children:r.jsx(z,{helpCenterPath:o,children:r.jsx(jt,{...n})})}))}const vt="all-categories-virtual-id",xt="uncategorized-virtual-id";function yt(e){return"all_services"===e.built_in||e.id===vt}function wt(e){return"uncategorized"===e.built_in||e.id===xt}function _t(e,t){for(const n of e){if(n.id===t)return n;if(n.children?.length){const e=_t(n.children,t);if(e)return e}}return null}function kt(e,t){for(const n of e){if(n.id===t)return[];if(n.children?.length){const e=kt(n.children,t);if(null!==e)return[n.id,...e]}}return null}const $t=a.div`
  width: 100%;
`,Ct=a.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding-left: ${e=>20*Math.min(e.$nestingLevel,6)+"px"};
`,St=a.div`
  display: flex;
  align-items: center;
  height: 40px;
  padding-right: 12px;
  padding-left: ${e=>{const t=32+20*Math.min(e.$nestingLevel,6);return e.$hasChildren?"12px":`${t}px`}};
  cursor: pointer;
  background-color: ${e=>e.$active?`${s({theme:e.theme,hue:"blue",shade:600})}33`:"transparent"};
  border-radius: 4px;

  &:hover {
    background-color: ${e=>e.$active?`${s({theme:e.theme,hue:"blue",shade:600})}47`:`${s({theme:e.theme,hue:"blue",shade:600})}14`};
  }

  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px
      ${e=>s({theme:e.theme,hue:"blue",shade:600})};
  }

  &:focus:not(:focus-visible) {
    box-shadow: none;
  }

  &:focus-visible {
    box-shadow: inset 0 0 0 2px
      ${e=>s({theme:e.theme,hue:"blue",shade:600})};
  }
`,qt=a.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 12px;
  height: 12px;
  margin-right: 8px;
  color: ${({theme:e})=>s({theme:e,hue:"grey",shade:600})};
  flex-shrink: 0;

  &:hover {
    color: ${({theme:e})=>s({theme:e,hue:"grey",shade:800})};
  }

  svg {
    width: 12px;
    height: 12px;
  }
`,Lt=a.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  gap: 8px;
`,Et=a.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,It=a.span`
  flex-shrink: 0;
  color: ${({theme:e})=>s({theme:e,hue:"grey",shade:600})};
`,Tt=({category:e,nestingLevel:t,expandedCategories:n,onToggleExpand:s,selectedCategoryId:a,onSelect:o})=>{const i=(e.children?.length??0)>0,c=n.has(e.id),u=yt(e),d=wt(e),h=a===e.id,{t:m}=l(),p=u?m("service-catalog-sidebar.all-services","All services"):d?m("service-catalog-sidebar.uncategorized","Uncategorized"):e.name;return r.jsxs(r.Fragment,{children:[r.jsx($t,{children:r.jsx(St,{$active:h,$nestingLevel:t,$hasChildren:i,onClick:()=>o(e.id),tabIndex:0,role:"button",onKeyDown:t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),o(e.id))},"data-test-id":u?"sidebar-all-services":`sidebar-category-${e.id}`,children:r.jsxs(Ct,{$nestingLevel:i?t:0,children:[i&&r.jsx(qt,{onClick:t=>{t.stopPropagation(),s(e.id)},"aria-label":c?m("service-catalog-sidebar.collapse-category","Collapse category"):m("service-catalog-sidebar.expand-category","Expand category"),type:"button",children:c?r.jsx(N,{}):r.jsx(M,{})}),r.jsxs(Lt,{children:[r.jsx(Et,{children:p}),"number"==typeof e.items_count&&r.jsx(It,{children:e.items_count})]})]})})}),i&&c&&r.jsx(r.Fragment,{children:e.children?.map(e=>r.jsx(Tt,{category:e,nestingLevel:t+1,selectedCategoryId:a,onSelect:o,expandedCategories:n,onToggleExpand:s},e.id))})]})},At=a.div`
  width: ${250}px;
`,Rt=({categories:t,selectedCategoryId:n,onSelect:s})=>{const[a,o]=e.useState(new Set),i=e.useCallback(e=>{o(t=>{const n=new Set(t);return n.has(e)?n.delete(e):n.add(e),n})},[]),l=e.useCallback(e=>{const n=new URLSearchParams(window.location.search);n.set("category_id",e),window.history.pushState({},"",`${window.location.pathname}?${n.toString()}`);const a=kt(t,e);a?.length&&o(e=>{const t=new Set(e);for(const e of a)t.add(e);return t}),s(e)},[t,s]);return e.useEffect(()=>{if(n){const e=kt(t,n);return void(e?.length&&o(t=>{const n=new Set(t);for(const t of e)n.add(t);return n}))}const e=t[0];e&&s(e.id)},[t,n,s]),r.jsx(At,{children:r.jsx("div",{children:t.map(e=>r.jsx(Tt,{category:e,nestingLevel:0,selectedCategoryId:n,onSelect:l,expandedCategories:a,onToggleExpand:i},e.id))})})},zt=a.div`
  height: 100%;
`,Ft=a.a`
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: ${e=>e.theme.borderRadii.md};
  padding: ${e=>e.theme.space.md};
  border: ${e=>e.theme.borders.sm}
    ${({theme:e})=>s({theme:e,hue:"grey",shade:300})};
  color: ${({theme:e})=>s({theme:e,variable:"foreground.default"})};

  &:hover {
    border-color: ${e=>e.theme.colors.primaryHue};
  }

  &:hover,
  &:visited {
    text-decoration: none;
  }
`,Pt=a.div`
  font-size: ${e=>e.theme.fontSizes.md};
  font-weight: ${e=>e.theme.fontWeights.semibold};
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-word;
`,Ut=a.div`
  font-size: ${e=>e.theme.fontSizes.sm};
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  word-break: break-word;
`,Nt=a.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${e=>e.theme.space.xxs};
  color: ${({theme:e})=>s({theme:e,variable:"foreground.default"})};
  margin-top: ${e=>e.theme.space.sm};
`,Mt=({serviceItem:t,helpCenterPath:n,selectedCategoryId:s})=>{const a=s?`${n}/services/${t.id}?category_id=${s}`:`${n}/services/${t.id}`,o=e.useMemo(()=>le(t.name||""),[t.name]),i=e.useMemo(()=>le(t.description||""),[t.description]);return r.jsx(zt,{"data-testid":"service-catalog-list-item-container",children:r.jsxs(Ft,{href:a,children:[r.jsx(qe,{size:"medium",url:t.thumbnail_url}),r.jsxs(Nt,{children:[r.jsx(Pt,{children:o}),r.jsx(Ut,{children:i})]})]})})},Ot=a.div`
  display: flex;
  flex-direction: column;
  background-color: ${({theme:e})=>s({theme:e,hue:"grey",shade:300})};
  height: 100%;
  border-radius: ${e=>e.theme.borderRadii.md};
  padding: ${e=>e.theme.space.md};
  border: ${e=>e.theme.borders.sm}
    ${({theme:e})=>s({theme:e,hue:"grey",shade:300})};
`,Ht=()=>r.jsx(Ot,{"aria-hidden":"true","data-testid":"service-catalog-list-item-skeleton",children:r.jsx(y,{width:"100%",height:"140px"})}),Dt=a(O)`
  padding: 0;
`,Vt=a(O.Col)`
  @media (min-width: 0px) {
    margin-bottom: ${e=>e.theme.space.md};
  }
`,Bt=({count:e=8})=>{const t=Math.max(1,e);return r.jsx(Dt,{children:r.jsx(O.Row,{wrap:"wrap",children:Array.from({length:t},(e,t)=>r.jsx(Vt,{xs:12,sm:6,md:4,lg:3,children:r.jsx(Ht,{})},t))})})},Gt=a.div`
  padding: ${e=>e.theme.space.xl} 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${e=>e.theme.space.md};
`,Jt=a.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${e=>e.theme.space.xxs};
`,Kt=({helpCenterPath:e,searchInputValue:t})=>{const{t:n}=l();return r.jsxs(Gt,{children:[r.jsxs(Jt,{children:[r.jsx(H,{children:n("service-catalog.empty-state.no-services","No services in sight")}),""===t?r.jsx(D,{children:n("service-catalog.empty-state.description","Once services are added to catalog, you'll find them here.")}):r.jsx(D,{children:n("service-catalog.empty-state.search-description","Enter your keywords in the search field.")})]}),""===t&&r.jsx(c,{isPrimary:!0,onClick:()=>{window.location.href=e},children:n("service-catalog.empty-state.go-to-homepage","Go to the homepage")})]})},Wt=a(G)`
  position: absolute;
  top: 4px;
  inset-inline-end: 4px;
`,Zt=({onChange:e})=>{const{t:t}=l();return r.jsx(V,{content:t("service-catalog.clear-search","Clear search"),placement:"bottom",size:"small",children:r.jsx(Wt,{"aria-label":t("service-catalog.clear-search","Clear search"),size:"small",focusInset:!0,onClick:()=>e(""),children:r.jsx(B,{})})})},Xt=a(W)`
  align-items: center;
  width: 320px;
  @media (max-width: 768px) {
    width: 100%;
    display: flex;
  }
`,Yt=a(Z)`
  padding-inline-end: ${e=>7*e.theme.space.base}px;
`,Qt=({searchInputValue:e,isLoading:t,onChange:n})=>{const{t:s}=l();return r.jsxs(Xt,{children:[r.jsx(Xt.Label,{hidden:!0,children:s("service-catalog.search-services","Search for services")}),r.jsx(Yt,{start:r.jsx(K,{}),type:"search",autoComplete:"off",end:t&&e?r.jsx(J,{}):void 0,value:e,placeholder:s("service-catalog.search-services","Search for services"),onChange:e=>n(e.target.value)}),!t&&e&&r.jsx(Zt,{onChange:n})]})};const en="name_asc",tn="sort",nn=new Set(["name_asc","name_desc","created_at_desc"]);function sn(e=window.location.search){const t=new URLSearchParams(e).get(tn);return function(e){return"string"==typeof e&&nn.has(e)}(t)?t:en}function an(e){switch(e){case"name_asc":return{sort_by:"name",sort_order:"asc"};case"name_desc":return{sort_by:"name",sort_order:"desc"};case"created_at_desc":return{sort_by:"created_at",sort_order:"desc"}}}const rn=a(c)`
  white-space: nowrap;
`;function on({selectedOption:e,onChange:t}){const{t:n}=l(),s={name_asc:n("service-catalog.sort.name-asc","A-Z"),name_desc:n("service-catalog.sort.name-desc","Z-A"),created_at_desc:n("service-catalog.sort.newest","Newest")};return r.jsx($,{button:t=>r.jsxs(rn,{...t,isBasic:!0,size:"small",children:[s[e],r.jsx(c.EndIcon,{children:r.jsx(k,{})})]}),onChange:({value:e})=>{e&&t(e)},children:r.jsxs(w,{type:"radio","aria-label":n("service-catalog.sort.aria-label","Sort services"),children:[r.jsx(_,{value:"name_asc",isSelected:"name_asc"===e,children:s.name_asc}),r.jsx(_,{value:"name_desc",isSelected:"name_desc"===e,children:s.name_desc}),r.jsx(_,{value:"created_at_desc",isSelected:"created_at_desc"===e,children:s.created_at_desc})]})})}const ln=a(O.Col)`
  margin-bottom: ${e=>e.theme.space.md};
`,cn=a.div`
  gap: ${e=>6*e.theme.space.base+"px"};
  display: flex;
  flex-direction: column;
`,un=a(O)`
  padding: 0;
`,dn=a(Q).attrs({tag:"h2",isBold:!0})`
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 600px;
`,hn=a.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${e=>e.theme.space.sm};
  flex-wrap: wrap;
`;function mn({helpCenterPath:t,selectedCategoryId:n,selectedCategoryName:s}){const[a,o]=e.useState(""),i=e.useRef(a);i.current=a;const[c,u]=e.useState(sn),d=e.useRef(c);d.current=c,e.useEffect(()=>{const e=()=>{const e=sn();e!==d.current&&u(e)};return window.addEventListener("popstate",e),()=>window.removeEventListener("popstate",e)},[]);const{t:h}=l(),{serviceCatalogItems:m,meta:p,count:g,isLoading:f,errorFetchingItems:j,fetchServiceCatalogItems:b}=function(){const[t,n]=e.useState(null),[s,a]=e.useState(0),[r,o]=e.useState(!0),[i,l]=e.useState(null),[c,u]=e.useState([]),d=e.useCallback(async(e,t,s,r)=>{o(!0);const i=new URLSearchParams;if(i.set("page[size]",16..toString()),t){const[e,n]=t.split("=");e&&n&&i.set(e,n)}e&&i.set("query",e),s&&i.set("category_id",String(s)),r&&(i.set("sort_by",r.sort_by),i.set("sort_order",r.sort_order));try{const e=await fetch(`/api/v2/help_center/service_catalog/items/search?${i.toString()}`);if(!e.ok)throw new Error(`HTTP error! status: ${e.status}`);const t=await e.json();n(t.meta),u(t.service_catalog_items),a(t.count)}catch(e){l(e)}finally{o(!1)}},[]);return{serviceCatalogItems:c,meta:t,count:s,isLoading:r,errorFetchingItems:i,fetchServiceCatalogItems:d}}();if(e.useEffect(()=>{j&&E({title:h("service-catalog.service-list-error-title","Services couldn't be loaded"),message:h("service-catalog.service-list-error-message","Give it a moment and try it again"),type:"error"})},[j,h]),j)throw j;const v=e.useMemo(()=>X((e,t,n,s)=>b(e,t,n,an(s)),300),[b]),x=function(e){return e?e===vt?null:e:null}(n),y=e.useRef(x),w=y.current!==x,_=e.useRef(0);f||(_.current=m.length);const k=w?void 0:_.current||void 0;e.useEffect(()=>{v.cancel(),y.current=x,b(i.current,null,x,an(c))},[b,x,c,v]),e.useEffect(()=>()=>v.cancel(),[v]);const $=s===vt?h("service-catalog-sidebar.all-services","All services"):s===xt?h("service-catalog-sidebar.uncategorized","Uncategorized"):s;return r.jsxs(cn,{children:[$&&r.jsx(dn,{children:$}),r.jsx(Qt,{searchInputValue:a,isLoading:f,onChange:e=>{o(e),v(e,null,x,c)}}),!w&&r.jsxs(hn,{children:[r.jsx("span",{children:h("service-catalog.service-count","{{count}} services",{"defaultValue.one":"{{count}} service",count:g})}),r.jsx(on,{selectedOption:c,onChange:e=>{e!==c&&(!function(e){const t=new URLSearchParams(window.location.search);e===en?t.delete(tn):t.set(tn,e);const n=t.toString(),s=n?`${window.location.pathname}?${n}`:window.location.pathname;window.history.pushState({},"",s)}(e),u(e))}})]}),f||w?r.jsx(Bt,{count:k}):r.jsxs(r.Fragment,{children:[r.jsx(un,{children:r.jsx(O.Row,{wrap:"wrap",children:m.map(e=>r.jsx(ln,{xs:12,sm:6,md:4,lg:3,children:r.jsx(Mt,{serviceItem:e,helpCenterPath:t,selectedCategoryId:x})},e.id))})}),0===m.length&&r.jsx(Kt,{helpCenterPath:t,searchInputValue:a}),p&&(p.before_cursor||p.after_cursor)&&r.jsxs(Y,{children:[r.jsx(Y.Previous,{onClick:()=>{p?.before_cursor&&b(a,"page[before]="+p.before_cursor,x,an(c))},disabled:null===p.before_cursor,children:h("service-catalog.pagination.previous","Previous")}),r.jsx(Y.Next,{onClick:()=>{p?.after_cursor&&b(a,"page[after]="+p.after_cursor,x,an(c))},disabled:null===p.after_cursor,children:h("service-catalog.pagination.next","Next")})]})]})]})}function pn(){return new URLSearchParams(window.location.search).get("category_id")}const gn=({helpCenterPath:t,categoryTree:n})=>{const s=n.length>0,[a,o]=e.useState(pn);e.useEffect(()=>{const e=()=>{o(pn())};return window.addEventListener("popstate",e),()=>window.removeEventListener("popstate",e)},[]);const i=e.useMemo(()=>{if(!a||!s)return null;if(a===vt)return vt;if(a===xt)return xt;const e=_t(n,a);return e?yt(e)?vt:wt(e)?xt:e.name:null},[a,n,s]),l=e.useCallback(e=>{o(e)},[]);return r.jsxs(r.Fragment,{children:[s&&r.jsx("aside",{className:"service-catalog-sidebar",children:r.jsx(Rt,{categories:(c=n,c.filter(e=>!wt(e))),selectedCategoryId:a,onSelect:l})}),r.jsx("main",{className:"service-catalog-list",children:r.jsx(mn,{helpCenterPath:t,selectedCategoryId:s?a:null,selectedCategoryName:i})})]});var c},fn=a.div`
  width: ${250}px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`,jn=a.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${e=>6*e.theme.space.base+"px"};
`,bn=a(O)`
  padding: 0;
`,vn=a(O.Col)`
  @media (min-width: 0px) {
    margin-bottom: ${e=>e.theme.space.md};
  }
`,xn=()=>r.jsxs(fn,{children:[r.jsx(y,{width:"100%",height:"40px"}),r.jsx(y,{width:"100%",height:"40px"}),r.jsx(y,{width:"100%",height:"40px"}),r.jsx(y,{width:"80%",height:"40px"}),r.jsx(y,{width:"80%",height:"40px"}),r.jsx(y,{width:"100%",height:"40px"})]}),yn=()=>r.jsxs(jn,{children:[r.jsx(y,{width:"200px",height:"28px"}),r.jsx(y,{width:"320px",height:"40px"}),r.jsx(y,{width:"120px",height:"20px"}),r.jsx(bn,{children:r.jsxs(O.Row,{wrap:"wrap",children:[r.jsx(vn,{xs:12,sm:6,md:4,lg:3,children:r.jsx(y,{width:"100%",height:"140px"})}),r.jsx(vn,{xs:12,sm:6,md:4,lg:3,children:r.jsx(y,{width:"100%",height:"140px"})}),r.jsx(vn,{xs:12,sm:6,md:4,lg:3,children:r.jsx(y,{width:"100%",height:"140px"})}),r.jsx(vn,{xs:12,sm:6,md:4,lg:3,children:r.jsx(y,{width:"100%",height:"140px"})})]})})]}),wn=()=>r.jsxs(r.Fragment,{children:[r.jsx("aside",{className:"service-catalog-sidebar",children:r.jsx(xn,{})}),r.jsx("main",{className:"service-catalog-list",children:r.jsx(yn,{})})]});async function _n({publishedOnly:e}){try{const t=new URLSearchParams({published_only:String(e)}),n=await fetch(`/api/v2/help_center/service_catalog/categories?${t.toString()}`);if(n.ok){const e=await n.json();return Array.isArray(e.service_catalog_categories)?e.service_catalog_categories:[]}return[]}catch{return[]}}async function kn(e,t,n,s,a){I(n);const o=F(t);A(e,r.jsx(R,{theme:o,children:r.jsx(wn,{})}));const[,i]=await Promise.all([T(a,n,[U("service-catalog",e=>function(e){switch(e){case"./translations/locales/af.json":return import("service-catalog-translations").then(function(e){return e.a});case"./translations/locales/ar-x-pseudo.json":return import("service-catalog-translations").then(function(e){return e.b});case"./translations/locales/ar.json":return import("service-catalog-translations").then(function(e){return e.c});case"./translations/locales/az.json":return import("service-catalog-translations").then(function(e){return e.d});case"./translations/locales/be.json":return import("service-catalog-translations").then(function(e){return e.e});case"./translations/locales/bg.json":return import("service-catalog-translations").then(function(e){return e.f});case"./translations/locales/bn.json":return import("service-catalog-translations").then(function(e){return e.g});case"./translations/locales/bs.json":return import("service-catalog-translations").then(function(e){return e.h});case"./translations/locales/ca.json":return import("service-catalog-translations").then(function(e){return e.i});case"./translations/locales/cs.json":return import("service-catalog-translations").then(function(e){return e.j});case"./translations/locales/cy.json":return import("service-catalog-translations").then(function(e){return e.k});case"./translations/locales/da.json":return import("service-catalog-translations").then(function(e){return e.l});case"./translations/locales/de-de.json":return import("service-catalog-translations").then(function(e){return e.m});case"./translations/locales/de-x-informal.json":return import("service-catalog-translations").then(function(e){return e.n});case"./translations/locales/de.json":return import("service-catalog-translations").then(function(e){return e.o});case"./translations/locales/el.json":return import("service-catalog-translations").then(function(e){return e.p});case"./translations/locales/en-001.json":return import("service-catalog-translations").then(function(e){return e.q});case"./translations/locales/en-150.json":return import("service-catalog-translations").then(function(e){return e.r});case"./translations/locales/en-au.json":return import("service-catalog-translations").then(function(e){return e.s});case"./translations/locales/en-ca.json":return import("service-catalog-translations").then(function(e){return e.t});case"./translations/locales/en-gb.json":return import("service-catalog-translations").then(function(e){return e.u});case"./translations/locales/en-my.json":return import("service-catalog-translations").then(function(e){return e.v});case"./translations/locales/en-ph.json":return import("service-catalog-translations").then(function(e){return e.w});case"./translations/locales/en-se.json":return import("service-catalog-translations").then(function(e){return e.x});case"./translations/locales/en-us.json":return import("service-catalog-translations").then(function(e){return e.y});case"./translations/locales/en-x-dev.json":return import("service-catalog-translations").then(function(e){return e.z});case"./translations/locales/en-x-keys.json":return import("service-catalog-translations").then(function(e){return e.A});case"./translations/locales/en-x-obsolete.json":return import("service-catalog-translations").then(function(e){return e.B});case"./translations/locales/en-x-pseudo.json":return import("service-catalog-translations").then(function(e){return e.C});case"./translations/locales/en-x-test.json":return import("service-catalog-translations").then(function(e){return e.D});case"./translations/locales/es-419.json":return import("service-catalog-translations").then(function(e){return e.E});case"./translations/locales/es-ar.json":return import("service-catalog-translations").then(function(e){return e.F});case"./translations/locales/es-cl.json":return import("service-catalog-translations").then(function(e){return e.G});case"./translations/locales/es-es.json":return import("service-catalog-translations").then(function(e){return e.H});case"./translations/locales/es-mx.json":return import("service-catalog-translations").then(function(e){return e.I});case"./translations/locales/es-pe.json":return import("service-catalog-translations").then(function(e){return e.J});case"./translations/locales/es.json":return import("service-catalog-translations").then(function(e){return e.K});case"./translations/locales/et.json":return import("service-catalog-translations").then(function(e){return e.L});case"./translations/locales/eu.json":return import("service-catalog-translations").then(function(e){return e.M});case"./translations/locales/fa-af.json":return import("service-catalog-translations").then(function(e){return e.N});case"./translations/locales/fa.json":return import("service-catalog-translations").then(function(e){return e.O});case"./translations/locales/fi.json":return import("service-catalog-translations").then(function(e){return e.P});case"./translations/locales/fil.json":return import("service-catalog-translations").then(function(e){return e.Q});case"./translations/locales/fo.json":return import("service-catalog-translations").then(function(e){return e.R});case"./translations/locales/fr-ca.json":return import("service-catalog-translations").then(function(e){return e.S});case"./translations/locales/fr-dz.json":return import("service-catalog-translations").then(function(e){return e.T});case"./translations/locales/fr-mu.json":return import("service-catalog-translations").then(function(e){return e.U});case"./translations/locales/fr.json":return import("service-catalog-translations").then(function(e){return e.V});case"./translations/locales/ga.json":return import("service-catalog-translations").then(function(e){return e.W});case"./translations/locales/gl.json":return import("service-catalog-translations").then(function(e){return e.X});case"./translations/locales/he.json":return import("service-catalog-translations").then(function(e){return e.Y});case"./translations/locales/hi.json":return import("service-catalog-translations").then(function(e){return e.Z});case"./translations/locales/hr.json":return import("service-catalog-translations").then(function(e){return e._});case"./translations/locales/hu.json":return import("service-catalog-translations").then(function(e){return e.$});case"./translations/locales/hy.json":return import("service-catalog-translations").then(function(e){return e.a0});case"./translations/locales/id.json":return import("service-catalog-translations").then(function(e){return e.a1});case"./translations/locales/is.json":return import("service-catalog-translations").then(function(e){return e.a2});case"./translations/locales/it-ch.json":return import("service-catalog-translations").then(function(e){return e.a3});case"./translations/locales/it.json":return import("service-catalog-translations").then(function(e){return e.a4});case"./translations/locales/ja.json":return import("service-catalog-translations").then(function(e){return e.a5});case"./translations/locales/ka.json":return import("service-catalog-translations").then(function(e){return e.a6});case"./translations/locales/kk.json":return import("service-catalog-translations").then(function(e){return e.a7});case"./translations/locales/kl-dk.json":return import("service-catalog-translations").then(function(e){return e.a8});case"./translations/locales/km.json":return import("service-catalog-translations").then(function(e){return e.a9});case"./translations/locales/ko.json":return import("service-catalog-translations").then(function(e){return e.aa});case"./translations/locales/ku.json":return import("service-catalog-translations").then(function(e){return e.ab});case"./translations/locales/ky.json":return import("service-catalog-translations").then(function(e){return e.ac});case"./translations/locales/lt.json":return import("service-catalog-translations").then(function(e){return e.ad});case"./translations/locales/lv.json":return import("service-catalog-translations").then(function(e){return e.ae});case"./translations/locales/mk.json":return import("service-catalog-translations").then(function(e){return e.af});case"./translations/locales/mn.json":return import("service-catalog-translations").then(function(e){return e.ag});case"./translations/locales/ms.json":return import("service-catalog-translations").then(function(e){return e.ah});case"./translations/locales/mt.json":return import("service-catalog-translations").then(function(e){return e.ai});case"./translations/locales/my.json":return import("service-catalog-translations").then(function(e){return e.aj});case"./translations/locales/ne.json":return import("service-catalog-translations").then(function(e){return e.ak});case"./translations/locales/nl-be.json":return import("service-catalog-translations").then(function(e){return e.al});case"./translations/locales/nl.json":return import("service-catalog-translations").then(function(e){return e.am});case"./translations/locales/no.json":return import("service-catalog-translations").then(function(e){return e.an});case"./translations/locales/oc-es.json":return import("service-catalog-translations").then(function(e){return e.ao});case"./translations/locales/oc.json":return import("service-catalog-translations").then(function(e){return e.ap});case"./translations/locales/pl.json":return import("service-catalog-translations").then(function(e){return e.aq});case"./translations/locales/pt-br.json":return import("service-catalog-translations").then(function(e){return e.ar});case"./translations/locales/pt.json":return import("service-catalog-translations").then(function(e){return e.as});case"./translations/locales/ro-md.json":return import("service-catalog-translations").then(function(e){return e.at});case"./translations/locales/ro.json":return import("service-catalog-translations").then(function(e){return e.au});case"./translations/locales/ru.json":return import("service-catalog-translations").then(function(e){return e.av});case"./translations/locales/si.json":return import("service-catalog-translations").then(function(e){return e.aw});case"./translations/locales/sk.json":return import("service-catalog-translations").then(function(e){return e.ax});case"./translations/locales/sl.json":return import("service-catalog-translations").then(function(e){return e.ay});case"./translations/locales/sq.json":return import("service-catalog-translations").then(function(e){return e.az});case"./translations/locales/sr-me.json":return import("service-catalog-translations").then(function(e){return e.aA});case"./translations/locales/sr.json":return import("service-catalog-translations").then(function(e){return e.aB});case"./translations/locales/sv.json":return import("service-catalog-translations").then(function(e){return e.aC});case"./translations/locales/sw-ke.json":return import("service-catalog-translations").then(function(e){return e.aD});case"./translations/locales/ta.json":return import("service-catalog-translations").then(function(e){return e.aE});case"./translations/locales/th.json":return import("service-catalog-translations").then(function(e){return e.aF});case"./translations/locales/tr.json":return import("service-catalog-translations").then(function(e){return e.aG});case"./translations/locales/uk.json":return import("service-catalog-translations").then(function(e){return e.aH});case"./translations/locales/ur-pk.json":return import("service-catalog-translations").then(function(e){return e.aI});case"./translations/locales/ur.json":return import("service-catalog-translations").then(function(e){return e.aJ});case"./translations/locales/uz.json":return import("service-catalog-translations").then(function(e){return e.aK});case"./translations/locales/vi.json":return import("service-catalog-translations").then(function(e){return e.aL});case"./translations/locales/zh-cn.json":return import("service-catalog-translations").then(function(e){return e.aM});case"./translations/locales/zh-tw.json":return import("service-catalog-translations").then(function(e){return e.aN});default:return new Promise(function(t,n){("function"==typeof queueMicrotask?queueMicrotask:setTimeout)(n.bind(null,new Error("Unknown variable dynamic import: "+e)))})}}(`./translations/locales/${e}.json`)),oe,P]),_n({publishedOnly:!("undefined"!=typeof window&&new URLSearchParams(window.location.search).get(me)===pe)})]);A(e,r.jsx(R,{theme:o,children:r.jsx(z,{helpCenterPath:s,fallback:r.jsx("main",{className:"service-catalog-list",children:r.jsx(ee,{helpCenterPath:s})}),children:r.jsx(gn,{helpCenterPath:s,categoryTree:i})})}))}export{bt as renderServiceCatalogItem,kn as renderServiceCatalogPage};
