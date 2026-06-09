.PHONY: type-check parser test build audit verify check

NPM ?= npm

type-check:
	$(NPM) run type-check

parser:
	$(NPM) run test:parser

test:
	$(NPM) test

build:
	$(NPM) run build

audit:
	$(NPM) audit --audit-level=high

verify: test

check: verify
