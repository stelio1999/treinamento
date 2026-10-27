// resources/js/dom-guard.js
// Protege o React contra alterações externas ao DOM (tradutores, extensões).
// Deve ser importado ANTES do React DOM inicializar.

const originalInsertBefore = Node.prototype.insertBefore;
const originalRemoveChild = Node.prototype.removeChild;

Node.prototype.insertBefore = function (newNode, referenceNode) {
    // Se o nó de referência já não é filho deste nó (foi movido pelo tradutor)
    if (referenceNode && referenceNode.parentNode !== this) {
        // Fallback seguro: anexa ao fim em vez de rebentar
        return this.appendChild(newNode);
    }
    return originalInsertBefore.call(this, newNode, referenceNode);
};

Node.prototype.removeChild = function (child) {
    // Se o nó já não é filho deste nó (foi movido pelo tradutor)
    if (child && child.parentNode !== this) {
        // No-op: o React pensa que removeu, mas o nó já não estava lá
        return child;
    }
    return originalRemoveChild.call(this, child);
};
