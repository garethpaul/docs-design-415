.PHONY: lint type-check parser test build audit verify check

ROOT := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
NPM ?= npm

lint:
	$(NPM) --prefix $(ROOT) run check

type-check:
	$(NPM) --prefix $(ROOT) run type-check

parser:
	$(NPM) --prefix $(ROOT) run test:parser

test:
	$(NPM) --prefix $(ROOT) test

build:
	$(NPM) --prefix $(ROOT) run build

audit:
	$(NPM) --prefix $(ROOT) audit --audit-level=moderate

verify: test

check: verify
