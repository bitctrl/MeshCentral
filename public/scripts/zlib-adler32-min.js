"undefined"==typeof ZLIB&&alert("ZLIB is not defined.  SRC zlib.js before zlib-adler32.js"),function(){var s=65521,v=5552;ZLIB.adler32=function(r,e,o,t){if("string"==typeof e){var a,d=r,c=e,C=o,h=t,A=d>>>16&65535;if(d&=65535,1==h)return d+=255&c.charCodeAt(C),s<=d&&(d-=s),s<=(A+=d)&&(A-=s),d|A<<16;if(null===c)return 1;if(h<16){for(;h--;)A+=d+=255&c.charCodeAt(C++);return s<=d&&(d-=s),d|(A%=s)<<16}for(;v<=h;){for(h-=v,a=347;A=(A=(A=(A=(A=(A=(A=(A=(A=(A=(A=(A=(A=(A=(A=(A+=d+=255&c.charCodeAt(C++))+(d+=255&c.charCodeAt(C++)))+(d+=255&c.charCodeAt(C++)))+(d+=255&c.charCodeAt(C++)))+(d+=255&c.charCodeAt(C++)))+(d+=255&c.charCodeAt(C++)))+(d+=255&c.charCodeAt(C++)))+(d+=255&c.charCodeAt(C++)))+(d+=255&c.charCodeAt(C++)))+(d+=255&c.charCodeAt(C++)))+(d+=255&c.charCodeAt(C++)))+(d+=255&c.charCodeAt(C++)))+(d+=255&c.charCodeAt(C++)))+(d+=255&c.charCodeAt(C++)))+(d+=255&c.charCodeAt(C++)))+(d+=255&c.charCodeAt(C++)),--a;);d%=s,A%=s}if(h){for(;16<=h;)h-=16,A=(A=(A=(A=(A=(A=(A=(A=(A=(A=(A=(A=(A=(A=(A=(A+=d+=255&c.charCodeAt(C++))+(d+=255&c.charCodeAt(C++)))+(d+=255&c.charCodeAt(C++)))+(d+=255&c.charCodeAt(C++)))+(d+=255&c.charCodeAt(C++)))+(d+=255&c.charCodeAt(C++)))+(d+=255&c.charCodeAt(C++)))+(d+=255&c.charCodeAt(C++)))+(d+=255&c.charCodeAt(C++)))+(d+=255&c.charCodeAt(C++)))+(d+=255&c.charCodeAt(C++)))+(d+=255&c.charCodeAt(C++)))+(d+=255&c.charCodeAt(C++)))+(d+=255&c.charCodeAt(C++)))+(d+=255&c.charCodeAt(C++)))+(d+=255&c.charCodeAt(C++));for(;h--;)A+=d+=255&c.charCodeAt(C++);d%=s,A%=s}return d|A<<16}var f,n=r,i=e,u=o,l=t,b=n>>>16&65535;if(n&=65535,1==l)return n+=i[u],s<=n&&(n-=s),s<=(b+=n)&&(b-=s),n|b<<16;if(null===i)return 1;if(l<16){for(;l--;)b+=n+=i[u++];return s<=n&&(n-=s),n|(b%=s)<<16}for(;v<=l;){for(l-=v,f=347;b=(b=(b=(b=(b=(b=(b=(b=(b=(b=(b=(b=(b=(b=(b=(b+=n+=i[u++])+(n+=i[u++]))+(n+=i[u++]))+(n+=i[u++]))+(n+=i[u++]))+(n+=i[u++]))+(n+=i[u++]))+(n+=i[u++]))+(n+=i[u++]))+(n+=i[u++]))+(n+=i[u++]))+(n+=i[u++]))+(n+=i[u++]))+(n+=i[u++]))+(n+=i[u++]))+(n+=i[u++]),--f;);n%=s,b%=s}if(l){for(;16<=l;)l-=16,b=(b=(b=(b=(b=(b=(b=(b=(b=(b=(b=(b=(b=(b=(b=(b+=n+=i[u++])+(n+=i[u++]))+(n+=i[u++]))+(n+=i[u++]))+(n+=i[u++]))+(n+=i[u++]))+(n+=i[u++]))+(n+=i[u++]))+(n+=i[u++]))+(n+=i[u++]))+(n+=i[u++]))+(n+=i[u++]))+(n+=i[u++]))+(n+=i[u++]))+(n+=i[u++]))+(n+=i[u++]);for(;l--;)b+=n+=i[u++];n%=s,b%=s}return n|b<<16},ZLIB.adler32_combine=function(r,e,o){var t,a;return o<0?4294967295:(a=(o%=s)*(t=65535&r),s<=(t+=(65535&e)+s-1)&&(t-=s),s<=t&&(t-=s),s<<1<=(a=a%s+((r>>16&65535)+(e>>16&65535)+s-o))&&(a-=s<<1),s<=a&&(a-=s),t|a<<16)}}()