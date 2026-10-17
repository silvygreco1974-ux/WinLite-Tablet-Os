/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { OSProvider } from './context/OSContext';
import { OSContainer } from './components/OSContainer';

export default function App() {
  return (
    <OSProvider>
      <OSContainer />
    </OSProvider>
  );
}
