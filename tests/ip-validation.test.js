import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidIpAddress } from '../assets/ip-validation.mjs';

test('accepts valid IPv4 formats', () => {
  for (const value of ['1.1.1.1', '8.8.8.8', '0.0.0.0', '255.255.255.255']) {
    assert.equal(isValidIpAddress(value), true, value);
  }
});

test('rejects incomplete and malformed IPv4 formats', () => {
  for (const value of ['999.1.1.1', '1.2.3', '1.2.3.4.5', '01.2.3.4', '1..2.3', '1.2.-1.4', '1.2.3.4:80', ' 1.1.1.1']) {
    assert.equal(isValidIpAddress(value), false, value);
  }
});

test('accepts fully expanded, compressed, and IPv4-tail IPv6 addresses', () => {
  for (const value of ['::1', '::', '2001:db8::1', '2001:db8:0:0:0:0:0:1', 'fe80::abcd', '::ffff:192.0.2.1', '1:2:3:4:5:6:192.0.2.1']) {
    assert.equal(isValidIpAddress(value), true, value);
  }
});

test('rejects malformed IPv6 strings that previously passed', () => {
  for (const value of [':::', '1:2:3', '1:2:3:4:5:6:7', '1:2:3:4:5:6:7:8:9', '1::2::3', '1::2:3:4:5:6:7:8', '12345::', '2001:db8::g', ':1:2:3:4:5:6:7', '1:2:3:4:5:6:7:', 'fe80::1%eth0', '::ffff:999.1.2.3']) {
    assert.equal(isValidIpAddress(value), false, value);
  }
});

test('rejects nonstrings and empty input', () => {
  for (const value of [null, undefined, '', ' ', 123, {}, []]) {
    assert.equal(isValidIpAddress(value), false);
  }
});
