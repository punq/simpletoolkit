"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import SuccessMessage from "./SuccessMessage";
import Toast from "./Toast";
import {
  decodeUrlSafe,
  encodeUrlSafe,
} from "@/app/utils/base64Utils";
import { track } from "@/app/utils/analytics";

type Alg = "HS256" | "RS256";

function utf8ToUint8Array(input: string) {
  return new TextEncoder().encode(input);
}

function uint8ArrayToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToUint8Array(base64url: string) {
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  if (pad === 2) base64 += "==";
  else if (pad === 3) base64 += "=";

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function importHMACKey(secret: string) {
  const keyData = utf8ToUint8Array(secret);
  return await window.crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function importRSAPublicKeyFromPEM(pem: string) {
  const cleaned = pem.replace(/-----BEGIN PUBLIC KEY-----/, "").replace(/-----END PUBLIC KEY-----/, "").replace(/\s+/g, "");
  const binary = atob(cleaned);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return await window.crypto.subtle.importKey(
    "spki",
    bytes.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );
}

export default function JwtUtility() {
  const [token, setToken] = useState("");
  const [secret, setSecret] = useState("");
  const [publicKeyPem, setPublicKeyPem] = useState("");
  const [headerJson, setHeaderJson] = useState('{"alg":"HS256","typ":"JWT"}');
  const [payloadJson, setPayloadJson] = useState('{"sub":"1234567890","name":"John Doe","iat":' + Math.floor(Date.now() / 1000) + '}');
  const [decodedHeader, setDecodedHeader] = useState<Record<string, unknown> | null>(null);
  const [decodedPayload, setDecodedPayload] = useState<Record<string, unknown> | null>(null);
  const [validationResult, setValidationResult] = useState<string | null>(null);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const tokenRef = useRef<HTMLTextAreaElement | null>(null);

  const clearResults = useCallback(() => {
    setDecodedHeader(null);
    setDecodedPayload(null);
    setValidationResult(null);
    setGeneratedToken(null);
  }, []);

  const decodeJWT = useCallback(() => {
    clearResults();
    if (!token.trim()) {
      setToast("Paste a JWT first");
      return;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      setValidationResult('Invalid token format');
      return;
    }

    try {
      const [h, p] = parts;
      const hRes = decodeUrlSafe(h);
      const pRes = decodeUrlSafe(p);
      if (!hRes.isValid) throw new Error(hRes.error || 'Invalid header encoding');
      if (!pRes.isValid) throw new Error(pRes.error || 'Invalid payload encoding');
      const header = JSON.parse(hRes.output);
      const payload = JSON.parse(pRes.output);
      setDecodedHeader(header);
      setDecodedPayload(payload);
      setValidationResult('Decoded');
      track('JWT Decoded');
    } catch (err: unknown) {
      const e = err as Error;
      setValidationResult('Decode error: ' + e.message);
    }
  }, [token, clearResults]);

  const validateJWT = useCallback(async (alg: Alg = 'HS256') => {
    clearResults();
    if (!token.trim()) {
      setToast('Paste a JWT first');
      return;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      setValidationResult('Invalid token format');
      return;
    }

    const [h64, p64, s64] = parts;
    try {
      const hRes = decodeUrlSafe(h64);
      const pRes = decodeUrlSafe(p64);
      if (hRes.isValid) setDecodedHeader(JSON.parse(hRes.output));
      if (pRes.isValid) setDecodedPayload(JSON.parse(pRes.output));

      const data = utf8ToUint8Array(`${h64}.${p64}`);
      const sig = base64UrlToUint8Array(s64);

      if (alg === 'HS256') {
        if (!secret) {
          setValidationResult('Secret required for HS256 validation');
          return;
        }
        const key = await importHMACKey(secret);
        const ok = await window.crypto.subtle.verify('HMAC', key, sig.buffer, data.buffer);
        setValidationResult(ok ? 'Valid (HS256)' : 'Invalid signature (HS256)');
        track('JWT Validated', { alg: 'HS256', valid: ok });
        return;
      }

      if (alg === 'RS256') {
        if (!publicKeyPem) {
          setValidationResult('Public key PEM required for RS256 validation');
          return;
        }
        const key = await importRSAPublicKeyFromPEM(publicKeyPem);
        const ok = await window.crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, sig.buffer, data.buffer);
        setValidationResult(ok ? 'Valid (RS256)' : 'Invalid signature (RS256)');
        track('JWT Validated', { alg: 'RS256', valid: ok });
        return;
      }
    } catch (err: unknown) {
      const e = err as Error;
      setValidationResult('Validation error: ' + e.message);
    }
  }, [token, secret, publicKeyPem, clearResults]);

  const generateJWT = useCallback(async (alg: Alg = 'HS256') => {
    clearResults();
    try {
      const header = JSON.parse(headerJson);
      const payload = JSON.parse(payloadJson);

      const headerStr = JSON.stringify(header);
      const payloadStr = JSON.stringify(payload);

      const headerB64 = encodeUrlSafe(headerStr).output;
      const payloadB64 = encodeUrlSafe(payloadStr).output;

      const signingInput = `${headerB64}.${payloadB64}`;

      if (alg === 'HS256') {
        if (!secret) {
          setValidationResult('Secret required to generate HS256 token');
          return;
        }
        const key = await importHMACKey(secret);
        const sig = await window.crypto.subtle.sign('HMAC', key, utf8ToUint8Array(signingInput).buffer);
        const sigBytes = new Uint8Array(sig as ArrayBuffer);
        const sigB64Url = uint8ArrayToBase64Url(sigBytes);
        const t = `${signingInput}.${sigB64Url}`;
        setGeneratedToken(t);
        setToken(t);
        setValidationResult('Generated (HS256)');
        track('JWT Generated', { alg: 'HS256' });
        return;
      }

      setValidationResult('Only HS256 generation is supported in this UI');
    } catch (err: unknown) {
      const e = err as Error;
      setValidationResult('Generation error: ' + e.message);
    }
  }, [headerJson, payloadJson, secret, clearResults]);

  const copyToClipboard = useCallback(async (text?: string) => {
    try {
      await navigator.clipboard.writeText(text ?? token);
      setToast('Copied to clipboard');
    } catch {
      setToast('Copy failed');
    }
  }, [token]);

  const prettyHeader = useMemo(() => (decodedHeader ? JSON.stringify(decodedHeader, null, 2) : ''), [decodedHeader]);
  const prettyPayload = useMemo(() => (decodedPayload ? JSON.stringify(decodedPayload, null, 2) : ''), [decodedPayload]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Client-Side JWT Validator & Generator</h1>
        <p className="text-sm text-gray-600 mb-4">Zero Uploads, 100% Client-Side Cryptography — your keys never leave your browser.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">JWT Token</label>
            <textarea
              ref={tokenRef}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste JWT here"
              className="w-full h-28 p-3 font-mono text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
            />

            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => decodeJWT()} className="px-4 py-2 bg-black text-white rounded-lg">Decode</button>
              <button onClick={() => validateJWT('HS256')} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg border border-gray-300">Validate (HS256)</button>
              <button onClick={() => validateJWT('RS256')} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg border border-gray-300">Validate (RS256)</button>
              <button onClick={() => copyToClipboard()} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">Copy</button>
              <button onClick={() => { setToken(''); clearResults(); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">Clear</button>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Secret (for HS256 signing/validation)</label>
              <input value={secret} onChange={(e) => setSecret(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm" placeholder="Enter shared secret" />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Public Key PEM (for RS256 validation)</label>
              <textarea value={publicKeyPem} onChange={(e) => setPublicKeyPem(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm h-28" placeholder="-----BEGIN PUBLIC KEY-----\n..." />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Generate Token (HS256)</label>
            <div className="grid grid-cols-1 gap-2">
              <label className="text-xs text-gray-600">Header (JSON)</label>
              <textarea value={headerJson} onChange={(e) => setHeaderJson(e.target.value)} className="w-full p-2 font-mono text-sm border border-gray-300 rounded-lg bg-gray-50 h-24" />
              <label className="text-xs text-gray-600">Payload (JSON)</label>
              <textarea value={payloadJson} onChange={(e) => setPayloadJson(e.target.value)} className="w-full p-2 font-mono text-sm border border-gray-300 rounded-lg bg-gray-50 h-32" />
              <div className="flex gap-2">
                <button onClick={() => generateJWT('HS256')} className="px-4 py-2 bg-black text-white rounded-lg">Generate HS256</button>
                <button onClick={() => { setHeaderJson('{"alg":"HS256","typ":"JWT"}'); setPayloadJson('{"sub":"123","name":"Alice","iat":' + Math.floor(Date.now() / 1000) + '}'); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">Reset</button>
                <button onClick={() => generatedToken && copyToClipboard(generatedToken)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">Copy Token</button>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Decoded Header</label>
              <pre className="p-3 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-gray-700 h-36 overflow-auto">{prettyHeader || '—'}</pre>

              <label className="block text-sm font-medium text-gray-700 mt-3 mb-1">Decoded Payload</label>
              <pre className="p-3 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-gray-700 h-36 overflow-auto">{prettyPayload || '—'}</pre>

              <div className="mt-3">
                {validationResult && (
                  <div>
                    <SuccessMessage message={validationResult} autoHideDuration={4000} />
                  </div>
                )}
                {generatedToken && (
                  <div className="mt-3 p-3 bg-white border border-gray-200 rounded">
                    <label className="block text-xs text-gray-600 mb-1">Generated Token</label>
                    <textarea readOnly value={generatedToken} className="w-full p-2 font-mono text-xs border border-gray-200 rounded h-28" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <details className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded">
          <summary className="cursor-pointer text-sm font-medium text-gray-800">FAQ — Trust & Security</summary>
          <div className="mt-2 text-sm text-gray-600">
            <p className="mt-2">Does my Secret Key leave my browser? No. All cryptographic operations use the Web Crypto API and keys are imported locally — nothing is uploaded.</p>
            <p className="mt-2">Which algorithms are supported? This UI supports HS256 for generation and validation. RS256 verification is supported when you paste a public key PEM (verification only).</p>
            <p className="mt-2">Can I verify tokens signed elsewhere? Yes — paste the token and provide the matching secret (HS256) or public key PEM (RS256).</p>
          </div>
        </details>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
